'use strict';

import streams from './utils/streams';

/**
 * options = {
 *    action: ['io', 'transform', 'transform-file', 'transforn-in-file', 'css-bundle'],
 *    file: [url],
 *    path: [url],
 *    help: [boolean]
 * }
 */
streams({
    action: 'transform',
    file: './data/MOCK_DATA.CSV',
    path: './data',
    //help: true
});