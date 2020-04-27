/**
 * Browser Policy
 * Set security-related policies to be enforced by newer browsers.
 * These policies help prevent and mitigate common attacks like
 * cross-site scripting and clickjacking.
 */

import { BrowserPolicy } from 'meteor/browser-policy-common'

const allowImageOrigin: string[] = ['via.placeholder.com']
const allowScriptOrigin: string[] = []
const allowStyleOrigin: string[] = ['https://fonts.googleapis.com']
const allowOriginForAll: string[] = ['https://fonts.gstatic.com']

allowImageOrigin.forEach(o => BrowserPolicy.content.allowImageOrigin(o))
allowScriptOrigin.forEach(o => BrowserPolicy.content.allowScriptOrigin(o))
allowStyleOrigin.forEach(o => BrowserPolicy.content.allowStyleOrigin(o))
allowOriginForAll.forEach(o => BrowserPolicy.content.allowOriginForAll(o))
