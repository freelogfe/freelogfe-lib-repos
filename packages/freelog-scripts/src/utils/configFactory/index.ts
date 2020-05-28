import devConfig from './webpack.dev';
import prodConfig from './webpack.prod';

export default function (env: 'production' | 'development' = 'development') {
  if (env === 'production') {
    return prodConfig;
  }
  return devConfig;
}
