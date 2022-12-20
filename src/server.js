import { set, listen, get } from './app';
import { PORT } from './config';

set('port', PORT);

listen(get('port'),  () => {
    console.log('Server on PORT', get('port'));
});