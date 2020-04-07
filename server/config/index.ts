import * as dev from './dev';
import * as prod from './prod';

// Get param
const isProduction: boolean = process.env.NODE_ENV === 'production';

export default isProduction ? prod : dev;
