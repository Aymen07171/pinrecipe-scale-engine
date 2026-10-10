import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_ALT_TEXT_LENGTH = 500;
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000;

/**
 * Category-to-Pinterest Board & Section mapping for Semplice Italian Kitchen
 */
const CATEGORY_BOARD_MAP = {
  'Budget-Friendly Italian': {
    board: 'Budget-Friendly Italian Recipes',
    section: 'Cucina Povera & Pantry',
    keywords: 'cucina povera, budget italian recipes, cheap family meals, italian pantry recipes, free recipe pdf',
  },
  'Quick Italian Dinners': {
    board: 'Quick 20-Minute Italian Dinners',
    section: 'Weeknight Skillets & Pastas',
    keywords: 'quick italian dinners, 20 minute pasta, weeknight italian meals, easy italian recipes, printable recipe',
  },
  'Pasta, Risotto & Gnocchi': {
    board: 'Authentic Pasta, Risotto & Gnocchi',
    section: 'Traditional Pasta Sauces',
    keywords: 'authentic italian pasta, trenette al pesto, homemade pasta sauce, italian comfort food, recipe pdf',
  },
  'Regional Italian Recipes': {
    board: 'Regional Italian Cooking',
    section: 'Tuscany, Liguria, Sardinia & Abruzzo',
    keywords: 'regional italian food, sardinian fregola, abruzzo recipes, tuscan cooking, traditional italian',
  },
  'Soups, Beans & Vegetables': {
    board: 'Italian Soups, Beans & Vegetables',
    section: 'One-Pot Bean Stews',
    keywords: 'italian bean soup, pasta e fagioli, tuscan white beans, healthy italian soup, vegetarian italian',
  },
  'Protein-Rich Italian Meals': {
    board: 'High-Protein Italian Meal Prep',
    section: 'Balanced Bowls & Lunches',
    keywords: 'high protein italian, chicken pesto meal prep, healthy pasta bowls, macro friendly italian, meal prep pdf',
  },
};

/**
 * Sanitize text and prevent CSV Formula Injection (CWE-1236)
 * Strips control chars and neutralizes leading =, +, -, @, \t, \r
 */
export function sanitizeField(rawVal) {
  if (rawVal === null || rawVal === undefined) return '';
  let str = String(rawVal)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\r?\n|\r/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Prevent CSV injection if field begins with formula trigger characters
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  return str;
}

/**
 * Escape a sanitized value for RFC-4180 CSV output
 */
export function escapeCsvCell(val, forceQuotes = false) {
  const clean = sanitizeField(val);
  if (!clean) return '';
  if (forceQuotes || clean.includes(',') || clean.includes('"') || clean.includes('\n')) {
    return `"${clean.replace(/"/g, '""')}"`;
  }
  return clean;
}

/**
 * Enforce character limit with clean word-boundary truncation.
 * Returns { text, wasTruncated, originalLength, truncatedPart }
 */
export function enforceTextLimit(rawText, maxLength) {
  const clean = sanitizeField(rawText);
  if (clean.length <= maxLength) {
    return {
      text: clean,
      wasTruncated: false,
      originalLength: clean.length,
      truncatedPart: '',
    };
  }

  const sliceLimit = maxLength - 3; // leave room for "..."
  let cutIndex = clean.lastIndexOf(' ', sliceLimit);
  if (cutIndex < Math.floor(maxLength * 0.6)) {
    cutIndex = sliceLimit;
  }

  const truncatedText = `${clean.slice(0, cutIndex).replace(/[.,;:\-–—]+$/, '')}...`;
  const overflow = clean.slice(cutIndex).trim();

  return {
    text: truncatedText,
    wasTruncated: true,
    originalLength: clean.length,
    truncatedPart: overflow,
  };
}

/**
 * Validate that a Media URL is well-formed and publicly accessible (HTTP 200 + image/video content-type)
 */
export async function validateMediaUrl(mediaUrl, timeoutMs = 8000) {
  if (!mediaUrl || typeof mediaUrl !== 'string') {
    return { valid: false, status: 0, contentType: '', error: 'Missing Media URL' };
  }

  let parsed;
  try {
    parsed = new URL(mediaUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, status: 0, contentType: '', error: `Unsupported protocol: ${parsed.protocol}` };
    }
  } catch {
    return { valid: false, status: 0, contentType: '', error: `Malformed URL: ${mediaUrl}` };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let res = await fetch(mediaUrl, {
      method: 'HEAD',
      signal: controller.signal,
      headers: { 'User-Agent': 'PinRecipe-Pinterest-Validator/1.0' },
    });

    // Fallback to GET if server rejects HEAD
    if (res.status === 405 || res.status === 403) {
      res = await fetch(mediaUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'User-Agent': 'PinRecipe-Pinterest-Validator/1.0' },
      });
    }

    clearTimeout(timer);

    const contentType = (res.headers.get('content-type') || '').toLowerCase();
    if (!res.ok) {
      return {
        valid: false,
        status: res.status,
        contentType,
        error: `Media URL returned HTTP ${res.status}`,
      };
    }

    const isMedia =
      contentType.startsWith('image/') ||
      contentType.startsWith('video/') ||
      /\.(jpe?g|png|webp|gif|mp4|mov)(\?.*)?$/i.test(parsed.pathname);

    if (!isMedia) {
      return {
        valid: false,
        status: res.status,
        contentType,
        error: `Invalid content-type for pin media: ${contentType || 'unknown'}`,
      };
    }

    return { valid: true, status: res.status, contentType, error: null };
  } catch (err) {
    clearTimeout(timer);
    return {
      valid: false,
      status: 0,
      contentType: '',
      error: `Media accessibility check failed: ${err.message || 'Network timeout'}`,
    };
  }
}

/**
 * Refresh Pinterest OAuth 2.0 Access Token using Refresh Token + App ID/Secret
 */
export async function refreshPinterestAccessToken({ appId, appSecret, refreshToken }) {
  if (!appId || !appSecret || !refreshToken) {
    throw new Error('Missing PINTEREST_APP_ID, PINTEREST_APP_SECRET, or PINTEREST_REFRESH_TOKEN for token refresh.');
  }

  const basicAuth = Buffer.from(`${appId}:${appSecret}`).toString('base64');
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const res = await fetch('https://api.pinterest.com/v5/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) {
    throw new Error(
      `Pinterest OAuth token refresh failed (HTTP ${res.status}): ${data.message || data.error_description || JSON.stringify(data)}`
    );
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || refreshToken,
    expiresIn: data.expires_in,
  };
}

/**
 * Helper to execute a Pinterest v5 API request with up to 3 exponential-backoff retries on transient errors
 */
async function pinterestFetchWithRetry(url, options, maxRetries = MAX_RETRIES) {
  let attempt = 0;
  let lastError = null;

  while (attempt <= maxRetries) {
    try {
      const res = await fetch(url, options);
      const isTransient = res.status === 429 || (res.status >= 500 && res.status <= 599);

      if (isTransient && attempt < maxRetries) {
        const retryAfterHeader = Number(res.headers.get('retry-after'));
        const delayMs =
          !Number.isNaN(retryAfterHeader) && retryAfterHeader > 0
            ? retryAfterHeader * 1000
            : INITIAL_BACKOFF_MS * Math.pow(2, attempt) + Math.floor(Math.random() * 250);
        await new Promise((r) => setTimeout(r, delayMs));
        attempt++;
        continue;
      }

      const data = await res.json().catch(() => ({}));
      return { ok: res.ok, status: res.status, data, attempts: attempt + 1 };
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        const delayMs = INITIAL_BACKOFF_MS * Math.pow(2, attempt) + Math.floor(Math.random() * 250);
        await new Promise((r) => setTimeout(r, delayMs));
        attempt++;
        continue;
      }
      return {
        ok: false,
        status: 0,
        data: { message: lastError?.message || 'Network request failed after retries' },
        attempts: attempt + 1,
      };
    }
  }
}

/**
 * Resolve or create Pinterest Board ID by name
 */
async function resolvePinterestBoardId(accessToken, boardName, boardCache) {
  const normalized = boardName.trim().toLowerCase();
  if (boardCache.has(normalized)) {
    return boardCache.get(normalized);
  }

  // 1. List existing boards
  const listRes = await pinterestFetchWithRetry('https://api.pinterest.com/v5/boards?page_size=100', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (listRes.ok && Array.isArray(listRes.data?.items)) {
    for (const b of listRes.data.items) {
      if (b.name && b.id) {
        boardCache.set(b.name.trim().toLowerCase(), b.id);
      }
    }
    if (boardCache.has(normalized)) {
      return boardCache.get(normalized);
    }
  }

  // 2. Create board if not found
  const createRes = await pinterestFetchWithRetry('https://api.pinterest.com/v5/boards', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: boardName.trim(),
      description: `Curated ${boardName.trim()} from Semplice Italian Kitchen (foodsprepared.wasmer.app).`,
      privacy: 'PUBLIC',
    }),
  });

  if (createRes.ok && createRes.data?.id) {
    boardCache.set(normalized, createRes.data.id);
    return createRes.data.id;
  }

  throw new Error(
    `Unable to resolve or create Pinterest board "${boardName}" (HTTP ${createRes.status}): ${createRes.data?.message || JSON.stringify(createRes.data)}`
  );
}

/**
 * Prepare, validate, and normalize recipes into structured Pin records
 * Enforces Title <= 100 chars, Description <= 500 chars, validates Media URLs, and builds publish dates.
 */
export async function prepareAndValidatePins(rawRecipes, options = {}) {
  const startPublishDate = options.startDate ? new Date(options.startDate) : new Date(Date.now() + 3600 * 1000);
  const intervalMinutes = Number(options.intervalMinutes) || 180; // default 3 hours apart
  const validateImages = options.validateImages !== false;

  // Cache media validation by URL so shared thumbnails are only checked once
  const mediaValidationCache = new Map();
  const preparedPins = [];

  for (let i = 0; i < rawRecipes.length; i++) {
    const r = rawRecipes[i];
    const catConfig = CATEGORY_BOARD_MAP[r.category] || {
      board: r.board || r.category || 'Italian Recipes',
      section: r.section || 'Everyday Italian',
      keywords: 'italian recipes, easy italian cooking, printable recipe pdf',
    };

    // Build candidate Title and Description
    const rawTitle =
      r.pinTitle ||
      (r.priority === 1
        ? `${r.title} — Authentic Step-by-Step Italian Kitchen Guide`
        : r.title || '');

    const rawDescription =
      r.pinDescription ||
      (r.priority === 7
        ? `${r.metaDescription || ''} Discover how traditional Genoese cooks boil diced Yukon Gold potatoes and tender green beans in the exact same pot as the trenette pasta so the starchy cooking water emulsifies with fresh basil, pine nuts, garlic, Parmigiano-Reggiano, Pecorino Fiore Sardo, and cold-pressed Ligurian extra virgin olive oil into a velvety emerald sauce. Grab the full step-by-step Italian recipe and free printable 1-page PDF recipe card at Semplice Italian Kitchen!`
        : `${r.metaDescription || ''} Grab the full step-by-step Italian recipe and free printable 1-page PDF recipe card at Semplice Italian Kitchen!`.trim());

    const titleCheck = enforceTextLimit(rawTitle, MAX_TITLE_LENGTH);
    const descCheck = enforceTextLimit(rawDescription, MAX_DESCRIPTION_LENGTH);

    const rawAltText =
      r.altText ||
      r.gallery?.[0]?.alt ||
      `Photo of ${titleCheck.text} — Semplice Italian Kitchen`;
    const altCheck = enforceTextLimit(rawAltText, MAX_ALT_TEXT_LENGTH);

    const mediaUrl = sanitizeField(r.thumbnailUrl || r.mediaUrl || r.imageUrl || '');
    const destinationLink = sanitizeField(
      r.permalink || r.link || `https://foodsprepared.wasmer.app/${r.slug || ''}/`
    );
    const boardName = sanitizeField(r.board || catConfig.board);
    const sectionName = sanitizeField(r.section || catConfig.section);
    const keywords = sanitizeField(r.keywords || catConfig.keywords);
    const isVideo = /\.(mp4|mov|m4v)(\?.*)?$/i.test(mediaUrl);
    const thumbnailCell = isVideo ? sanitizeField(r.videoThumbnail || '0:02') : '';

    // Compute scheduled publish date (ISO UTC format YYYY-MM-DDTHH:mm:ss)
    const pinDate = new Date(startPublishDate.getTime() + i * intervalMinutes * 60 * 1000);
    const publishDateIso = pinDate.toISOString().slice(0, 19);

    // Collect validation errors & truncation notes
    const validationErrors = [];
    const truncatedNotes = [];

    if (!titleCheck.text) {
      validationErrors.push('Missing Title');
    }
    if (!descCheck.text) {
      validationErrors.push('Missing Description');
    }
    if (!destinationLink || !/^https?:\/\//i.test(destinationLink)) {
      validationErrors.push('Invalid or missing Destination Link URL');
    }
    if (!boardName) {
      validationErrors.push('Missing Pinterest board name');
    }

    if (titleCheck.wasTruncated) {
      truncatedNotes.push(
        `Title truncated from ${titleCheck.originalLength} to ${titleCheck.text.length} chars (removed: "${titleCheck.truncatedPart}")`
      );
    }
    if (descCheck.wasTruncated) {
      truncatedNotes.push(
        `Description truncated from ${descCheck.originalLength} to ${descCheck.text.length} chars (removed: "${descCheck.truncatedPart}")`
      );
    }

    // Validate Media URL accessibility
    let mediaStatus = { valid: true, status: 200, contentType: 'image/jpeg', error: null };
    if (validateImages) {
      if (mediaValidationCache.has(mediaUrl)) {
        mediaStatus = mediaValidationCache.get(mediaUrl);
      } else {
        mediaStatus = await validateMediaUrl(mediaUrl);
        mediaValidationCache.set(mediaUrl, mediaStatus);
      }
      if (!mediaStatus.valid) {
        validationErrors.push(mediaStatus.error || 'Media URL inaccessible');
      }
    }

    preparedPins.push({
      index: i + 1,
      id: r.id || `pin-${i + 1}`,
      priority: r.priority || i + 1,
      title: titleCheck.text,
      mediaUrl,
      board: boardName,
      thumbnail: thumbnailCell,
      description: descCheck.text,
      link: destinationLink,
      publishDate: publishDateIso,
      keywords,
      altText: altCheck.text,
      section: sectionName,
      wasTruncated: titleCheck.wasTruncated || descCheck.wasTruncated,
      truncatedText: truncatedNotes.join(' | '),
      validationErrors,
      isValid: validationErrors.length === 0,
      mediaValidation: mediaStatus,
    });
  }

  return preparedPins;
}

/**
 * Generate both:
 * 1) Strict 8-column Pinterest Native Bulk Import CSV:
 *    Title,Media URL,Pinterest board,Thumbnail,Description,Link,Publish date,Keywords
 * 2) Extended 12-column Audit CSV (includes Alt text, Section, Truncated text, Validation errors)
 */
export function generatePinterestCsvFiles(preparedPins) {
  const strictHeader = [
    'Title',
    'Media URL',
    'Pinterest board',
    'Thumbnail',
    'Description',
    'Link',
    'Publish date',
    'Keywords',
  ].join(',');

  const extendedHeader = [
    'Title',
    'Media URL',
    'Pinterest board',
    'Thumbnail',
    'Description',
    'Link',
    'Publish date',
    'Keywords',
    'Alt text',
    'Section',
    'Truncated text',
    'Validation errors',
  ].join(',');

  const strictRows = [strictHeader];
  const extendedRows = [extendedHeader];

  for (const pin of preparedPins) {
    // Only include valid pins in the strict Pinterest bulk upload CSV
    if (pin.isValid) {
      strictRows.push(
        [
          escapeCsvCell(pin.title),
          escapeCsvCell(pin.mediaUrl),
          escapeCsvCell(pin.board),
          escapeCsvCell(pin.thumbnail),
          escapeCsvCell(pin.description, true),
          escapeCsvCell(pin.link),
          escapeCsvCell(pin.publishDate),
          escapeCsvCell(pin.keywords, true),
        ].join(',')
      );
    }

    // Include all pins in the extended audit CSV with truncation & validation columns
    extendedRows.push(
      [
        escapeCsvCell(pin.title),
        escapeCsvCell(pin.mediaUrl),
        escapeCsvCell(pin.board),
        escapeCsvCell(pin.thumbnail),
        escapeCsvCell(pin.description, true),
        escapeCsvCell(pin.link),
        escapeCsvCell(pin.publishDate),
        escapeCsvCell(pin.keywords, true),
        escapeCsvCell(pin.altText),
        escapeCsvCell(pin.section),
        escapeCsvCell(pin.truncatedText),
        escapeCsvCell(pin.validationErrors.join('; ')),
      ].join(',')
    );
  }

  return {
    strictCsv: '\uFEFF' + strictRows.join('\r\n') + '\r\n',
    extendedCsv: '\uFEFF' + extendedRows.join('\r\n') + '\r\n',
  };
}

/**
 * Main Orchestrator:
 * 1. Validates and normalizes all recipe pins (character limits, media URL accessibility, CSV sanitization)
 * 2. Attempts automatic publishing via Pinterest API v5 (with OAuth refresh & 3x exponential backoff)
 * 3. Automatically generates the UTF-8 CSV fallback files & detailed summary report
 */
export async function publishOrFallbackToCsv(rawRecipes, authConfig = {}, options = {}) {
  const startedAt = new Date().toISOString();
  const logs = [];
  const log = (level, message, meta = {}) => {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta,
    };
    logs.push(entry);
  };

  log('INFO', `Starting Pinterest publishing job for ${rawRecipes.length} recipe(s)...`);

  // Step 1: Prepare & Validate all pins
  const preparedPins = await prepareAndValidatePins(rawRecipes, options);
  const validPins = preparedPins.filter((p) => p.isValid);
  const invalidPins = preparedPins.filter((p) => !p.isValid);
  const truncatedPins = preparedPins.filter((p) => p.wasTruncated);

  log(
    'INFO',
    `Validation complete: ${validPins.length}/${preparedPins.length} valid, ${invalidPins.length} invalid, ${truncatedPins.length} truncated to fit character limits.`
  );

  for (const tp of truncatedPins) {
    log('WARN', `Pin #${tp.index} ("${tp.title}") exceeded text limits and was truncated: ${tp.truncatedText}`);
  }
  for (const ip of invalidPins) {
    log('ERROR', `Pin #${ip.index} ("${ip.title || ip.id}") failed validation: ${ip.validationErrors.join('; ')}`);
  }

  // Step 2: Check Pinterest API Credentials & Attempt Automatic Publishing
  let accessToken = (authConfig.accessToken || process.env.PINTEREST_ACCESS_TOKEN || '').trim();
  const refreshToken = (authConfig.refreshToken || process.env.PINTEREST_REFRESH_TOKEN || '').trim();
  const appId = (authConfig.appId || process.env.PINTEREST_APP_ID || '').trim();
  const appSecret = (authConfig.appSecret || process.env.PINTEREST_APP_SECRET || '').trim();

  const apiResults = [];
  let publishedCount = 0;
  let failedApiCount = 0;
  let fallbackTriggered = false;
  let fallbackReason = '';

  // If no access token is present, try refreshing via refresh_token if available
  if (!accessToken && refreshToken && appId && appSecret) {
    try {
      log('INFO', 'No access token provided; attempting OAuth 2.0 token refresh...');
      const refreshed = await refreshPinterestAccessToken({ appId, appSecret, refreshToken });
      accessToken = refreshed.accessToken;
      log('INFO', 'Successfully refreshed Pinterest OAuth 2.0 access token.');
    } catch (err) {
      fallbackTriggered = true;
      fallbackReason = err.message;
      log('WARN', `OAuth token refresh failed (${err.message}). Falling back to bulk CSV generation.`);
    }
  }

  if (!accessToken) {
    fallbackTriggered = true;
    fallbackReason =
      fallbackReason ||
      'Pinterest OAuth Access Token (PINTEREST_ACCESS_TOKEN) is not configured. Triggering automatic CSV Bulk Upload fallback.';
    log('WARN', fallbackReason);
  } else {
    log('INFO', 'Pinterest Access Token detected. Attempting automatic pin publishing via Pinterest REST API v5...');
    const boardCache = new Map();
    let tokenRefreshedDuringRun = false;

    for (const pin of validPins) {
      try {
        let boardId = pin.boardId;
        if (!boardId) {
          try {
            boardId = await resolvePinterestBoardId(accessToken, pin.board, boardCache);
          } catch (boardErr) {
            // Check if 401 and we can refresh token once
            if (
              boardErr.message.includes('401') &&
              !tokenRefreshedDuringRun &&
              refreshToken &&
              appId &&
              appSecret
            ) {
              log('INFO', 'Access token expired (HTTP 401). Refreshing token and retrying...');
              const refreshed = await refreshPinterestAccessToken({ appId, appSecret, refreshToken });
              accessToken = refreshed.accessToken;
              tokenRefreshedDuringRun = true;
              boardId = await resolvePinterestBoardId(accessToken, pin.board, boardCache);
            } else {
              throw boardErr;
            }
          }
        }

        const pinPayload = {
          board_id: boardId,
          title: pin.title,
          description: pin.description,
          link: pin.link,
          alt_text: pin.altText,
          media_source: {
            source_type: 'image_url',
            url: pin.mediaUrl,
          },
        };

        const pubRes = await pinterestFetchWithRetry('https://api.pinterest.com/v5/pins', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pinPayload),
        });

        if (pubRes.ok && pubRes.data?.id) {
          publishedCount++;
          apiResults.push({
            pinIndex: pin.index,
            title: pin.title,
            status: 'published',
            pinterestPinId: pubRes.data.id,
            board: pin.board,
            link: pin.link,
            attempts: pubRes.attempts,
          });
          log(
            'SUCCESS',
            `Published Pin #${pin.index}: "${pin.title}" -> Pinterest Pin ID ${pubRes.data.id} (attempts: ${pubRes.attempts})`
          );
        } else {
          failedApiCount++;
          const errMsg =
            pubRes.data?.message ||
            pubRes.data?.error ||
            `HTTP ${pubRes.status} after ${pubRes.attempts} attempt(s)`;
          apiResults.push({
            pinIndex: pin.index,
            title: pin.title,
            status: 'failed',
            board: pin.board,
            link: pin.link,
            attempts: pubRes.attempts,
            error: errMsg,
          });
          log('ERROR', `Failed to publish Pin #${pin.index} ("${pin.title}"): ${errMsg}`);
        }
      } catch (err) {
        failedApiCount++;
        apiResults.push({
          pinIndex: pin.index,
          title: pin.title,
          status: 'failed',
          board: pin.board,
          link: pin.link,
          attempts: 1,
          error: err.message,
        });
        log('ERROR', `Exception publishing Pin #${pin.index} ("${pin.title}"): ${err.message}`);
      }
    }

    if (failedApiCount > 0 || publishedCount < validPins.length) {
      fallbackTriggered = true;
      fallbackReason = `${failedApiCount} of ${validPins.length} pin(s) failed direct API publishing. Generated fallback CSV for bulk upload.`;
      log('WARN', fallbackReason);
    }
  }

  // Step 3: Always generate the UTF-8 CSV files & Summary Report so they are ready for download/import
  const { strictCsv, extendedCsv } = generatePinterestCsvFiles(preparedPins);

  const summaryReport = {
    jobStartedAt: startedAt,
    jobCompletedAt: new Date().toISOString(),
    mode: publishedCount === validPins.length && validPins.length > 0 && !fallbackTriggered ? 'api_direct' : 'csv_fallback',
    fallbackTriggered,
    fallbackReason: fallbackReason || null,
    totals: {
      totalRecipesInput: rawRecipes.length,
      validRowsGenerated: validPins.length,
      invalidRowsSkippedFromStrictCsv: invalidPins.length,
      rowsWithTruncatedText: truncatedPins.length,
      apiPublishedSuccess: publishedCount,
      apiPublishedFailed: failedApiCount,
    },
    characterLimitsEnforced: {
      titleMaxChars: MAX_TITLE_LENGTH,
      descriptionMaxChars: MAX_DESCRIPTION_LENGTH,
      altTextMaxChars: MAX_ALT_TEXT_LENGTH,
    },
    truncatedRowsDetail: truncatedPins.map((p) => ({
      rowNumber: p.index,
      title: p.title,
      truncatedInfo: p.truncatedText,
    })),
    invalidRowsDetail: invalidPins.map((p) => ({
      rowNumber: p.index,
      title: p.title,
      errors: p.validationErrors,
    })),
    apiResults,
    pins: preparedPins,
    logs,
  };

  return {
    strictCsv,
    extendedCsv,
    summaryReport,
  };
}

// CLI execution when run directly via `node scripts/pinterest_publisher_and_csv_export.mjs`
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  (async () => {
    const articlesPath = path.join(__dirname, '..', 'output', 'published_wordpress_12_articles.json');
    const rawArticles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

    const { strictCsv, extendedCsv, summaryReport } = await publishOrFallbackToCsv(rawArticles);

    const outDir = path.join(__dirname, '..', 'output');
    const strictCsvPath = path.join(outDir, 'pinterest_bulk_upload_template.csv');
    const extendedCsvPath = path.join(outDir, 'pinterest_bulk_audit_extended.csv');
    const reportJsonPath = path.join(outDir, 'pinterest_publish_summary_report.json');
    const logTxtPath = path.join(outDir, 'pinterest_publish_log.txt');

    fs.writeFileSync(strictCsvPath, strictCsv, 'utf8');
    fs.writeFileSync(extendedCsvPath, extendedCsv, 'utf8');
    fs.writeFileSync(reportJsonPath, JSON.stringify(summaryReport, null, 2), 'utf8');

    const humanLogLines = [
      '================================================================================',
      ' PINTEREST AUTOMATIC PUBLISHER & BULK CSV FALLBACK — EXECUTION SUMMARY REPORT',
      '================================================================================',
      `Job Started:               ${summaryReport.jobStartedAt}`,
      `Job Completed:             ${summaryReport.jobCompletedAt}`,
      `Execution Mode:            ${summaryReport.mode.toUpperCase()}`,
      `Fallback Triggered:        ${summaryReport.fallbackTriggered ? 'YES (' + summaryReport.fallbackReason + ')' : 'NO'}`,
      '--------------------------------------------------------------------------------',
      `Total Recipes Processed:   ${summaryReport.totals.totalRecipesInput}`,
      `Valid CSV Rows Generated:  ${summaryReport.totals.validRowsGenerated}`,
      `Invalid/Missing Rows:      ${summaryReport.totals.invalidRowsSkippedFromStrictCsv}`,
      `Rows Truncated (Limits):   ${summaryReport.totals.rowsWithTruncatedText}`,
      `Direct API Successes:      ${summaryReport.totals.apiPublishedSuccess}`,
      `Direct API Failures:       ${summaryReport.totals.apiPublishedFailed}`,
      '--------------------------------------------------------------------------------',
      'OUTPUT FILES GENERATED:',
      `  1. Strict Pinterest Template CSV:  ${strictCsvPath}`,
      `  2. Extended Audit CSV (w/ Errors): ${extendedCsvPath}`,
      `  3. JSON Summary Report:            ${reportJsonPath}`,
      '--------------------------------------------------------------------------------',
      'DETAILED EXECUTION LOG:',
      ...summaryReport.logs.map((l) => `[${l.timestamp}] [${l.level}] ${l.message}`),
      '================================================================================',
    ];
    fs.writeFileSync(logTxtPath, humanLogLines.join('\n') + '\n', 'utf8');

    console.log(humanLogLines.join('\n'));
  })().catch((err) => {
    console.error('Fatal error in Pinterest Publisher CLI:', err);
    process.exit(1);
  });
}
