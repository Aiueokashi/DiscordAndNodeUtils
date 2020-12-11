const fetch = require('node-fetch');
const crypto = require('crypto');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
const { stripIndents } = require('common-tags');

class Util {
	static shorten(text, maxLen = 2000) { //trim string more than 2000 characters
		return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
	}

	static trimArray(arr, maxLen = 100) { //trim array more than 100 indexes
		if (arr.length > maxLen) {
			const len = arr.length - maxLen;
			arr = arr.slice(0, maxLen);
			arr.push(`${len} more...`);
		}
		return arr;
	}

	static firstUpperCase(text) {  //upper
		return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
	}

	static escapeRegex(str) {  //regex
		return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
	}

	static base64(text, mode = 'encode') {  //encode and decode texts 
		if (mode === 'encode') return Buffer.from(text).toString('base64');
		if (mode === 'decode') return Buffer.from(text, 'base64').toString('utf8') || null;
		throw new TypeError(`${mode} base64 mode is not supported`);
	}

  	static fetchData(url = '') {  //fetch json data
    		return fetch(url).then(res => res.json());
  	}
	
	static delay(ms) {  // delay with (ms)
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	
	static shuffle(array) {  //shuffle arrays
		const arr = array.slice(0);
		for (let i = arr.length - 1; i >= 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = arr[i];
			arr[i] = arr[j];
			arr[j] = temp;
		}
		return arr;
	}
	
	static randomRange(min, max) {  //return random int min-max
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	static sortByName(arr, prop) {  //sort by name in array
		return arr.sort((a, b) => {
			if (prop) return a[prop].toLowerCase() > b[prop].toLowerCase() ? 1 : -1;
			return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
		});
	}
	
	static formatTime(time) {  //format time 
		const min = Math.floor(time / 60);
		const sec = Math.floor(time - (min * 60));
		const ms = time - sec - (min * 60);
		return `${min}:${sec.toString().padStart(2, '0')}.${ms.toFixed(4).slice(2)}`;
	}
	
	static embedURL(title, url, display) {  //display URL in discord Embed
		return `[${title}](${url.replaceAll(')', '%29')}${display ? ` "${display}"` : ''})`;
	}
	
	static cleanAnilistHTML(html, removeLineBreaks = true) {
		let clean = html;
		if (removeLineBreaks) clean = clean.replace(/\r|\n|\f/g, '');
		clean = entities.decode(clean);
		clean = clean
			.replaceAll('<br>', '\n')
			.replace(/<\/?i>/g, '*')
			.replace(/<\/?b>/g, '**')
			.replace(/~!|!~/g, '||');
		if (clean.length > 2000) clean = `${clean.substr(0, 1995)}...`;
		const spoilers = (clean.match(/\|\|/g) || []).length;
		if (spoilers !== 0 && (spoilers && (spoilers % 2))) clean += '||';
		return clean;
	}
}

module.exports = Util;
