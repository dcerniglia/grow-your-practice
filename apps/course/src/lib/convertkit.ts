const CONVERTKIT_API_URL = 'https://api.convertkit.com/v3'

function getApiKey(): string | null {
  const key = process.env.CONVERTKIT_API_KEY
  if (!key) {
    console.warn('CONVERTKIT_API_KEY is not set — ConvertKit functionality disabled.')
    return null
  }
  return key
}

function getFormId(): string | null {
  const id = process.env.CONVERTKIT_FORM_ID
  if (!id) {
    console.warn('CONVERTKIT_FORM_ID is not set — ConvertKit subscribe disabled.')
    return null
  }
  return id
}

/**
 * Adds a subscriber to the ConvertKit form, optionally applying tags.
 * Gracefully no-ops if API key or form ID is missing.
 */
export async function addSubscriber(
  email: string,
  tags?: string[],
): Promise<void> {
  const apiKey = getApiKey()
  const formId = getFormId()
  if (!apiKey || !formId) return

  const response = await fetch(
    `${CONVERTKIT_API_URL}/forms/${formId}/subscribe`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, email }),
    },
  )

  if (!response.ok) {
    console.error(
      `ConvertKit addSubscriber failed (${response.status}):`,
      await response.text(),
    )
    return
  }

  if (tags && tags.length > 0) {
    for (const tag of tags) {
      await tagSubscriber(email, tag)
    }
  }
}

/**
 * Adds a tag to a subscriber. Creates the tag if it doesn't exist.
 * Gracefully no-ops if API key is missing.
 */
export async function tagSubscriber(
  email: string,
  tagName: string,
): Promise<void> {
  const apiKey = getApiKey()
  if (!apiKey) return

  // First, find or create the tag
  const tagId = await findOrCreateTag(apiKey, tagName)
  if (!tagId) return

  const response = await fetch(
    `${CONVERTKIT_API_URL}/tags/${tagId}/subscribe`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, email }),
    },
  )

  if (!response.ok) {
    console.error(
      `ConvertKit tagSubscriber failed (${response.status}):`,
      await response.text(),
    )
  }
}

/**
 * Removes a tag from a subscriber.
 * Gracefully no-ops if API key is missing.
 */
export async function removeTag(
  email: string,
  tagName: string,
): Promise<void> {
  const apiKey = getApiKey()
  if (!apiKey) return

  // Find the tag ID
  const tagId = await findOrCreateTag(apiKey, tagName)
  if (!tagId) return

  // Find the subscriber ID
  const subscriberResponse = await fetch(
    `${CONVERTKIT_API_URL}/subscribers?api_secret=${apiKey}&email_address=${encodeURIComponent(email)}`,
  )

  if (!subscriberResponse.ok) return

  const subscriberData = await subscriberResponse.json()
  const subscriber = subscriberData.subscribers?.[0]
  if (!subscriber) return

  const response = await fetch(
    `${CONVERTKIT_API_URL}/subscribers/${subscriber.id}/tags/${tagId}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_secret: apiKey }),
    },
  )

  if (!response.ok) {
    console.error(
      `ConvertKit removeTag failed (${response.status}):`,
      await response.text(),
    )
  }
}

/**
 * Finds an existing tag by name or creates it. Returns the tag ID.
 */
async function findOrCreateTag(
  apiKey: string,
  tagName: string,
): Promise<number | null> {
  // List existing tags
  const listResponse = await fetch(
    `${CONVERTKIT_API_URL}/tags?api_key=${apiKey}`,
  )

  if (listResponse.ok) {
    const data = await listResponse.json()
    const existing = data.tags?.find(
      (t: { name: string; id: number }) => t.name === tagName,
    )
    if (existing) return existing.id
  }

  // Create the tag
  const createResponse = await fetch(`${CONVERTKIT_API_URL}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      tag: { name: tagName },
    }),
  })

  if (!createResponse.ok) {
    console.error(
      `ConvertKit createTag failed (${createResponse.status}):`,
      await createResponse.text(),
    )
    return null
  }

  const tagData = await createResponse.json()
  return tagData.id ?? null
}
