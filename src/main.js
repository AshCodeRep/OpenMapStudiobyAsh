/**
 * Reconstructed browser entry point.
 *
 * The source for the original React screen was not included in the upload.
 * It is therefore imported from the verified production module below, while
 * all project bootstrap and extension points are available in source form.
 */
import '../assets/index-JnKeWNpm.css';
import { i as getReact, t as getClient } from '../assets/framework-CXnKph_e.js';
import App from '../assets/page-D7Nn_9ji.js';

const root = document.getElementById('root');

if (!root) {
  throw new Error('OpenMap Studio could not find the #root mount element.');
}

getClient().hydrateRoot(root, getReact().createElement(App));
