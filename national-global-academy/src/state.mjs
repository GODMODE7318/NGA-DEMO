// Optional local demo content. Do not place enquiry data in the public project directory.
import {readFileSync} from 'node:fs';
export let state={};
if(process.env.NGA_DATA_FILE){try{state=JSON.parse(readFileSync(process.env.NGA_DATA_FILE,'utf8'))}catch(e){if(e.code!=='ENOENT')throw e}}
