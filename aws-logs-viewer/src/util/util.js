/* eslint-disable import/no-anonymous-default-export */
const isEmpty = (obj) => {
     if(obj === undefined) return true;
     if(obj === null) return true;
     return Object.keys(obj).length === 0 && obj.constructor === Object;
};

const convertTime = (longTime) => {
     let date = new Date(longTime);
     let yearString = `${date.getFullYear()}`;
     let monthString = date.getMonth()+1 <10 ? `0${date.getMonth()+1}`: (date.getMonth()+1);
     let dayString = date.getDate() <10 ? `0${date.getDate()}`: (date.getDate());
     let hourString = date.getHours() <10?  `0${date.getHours()}`: (date.getHours());
     let minString = date.getMinutes() <10 ? `0${date.getMinutes()}`: (date.getMinutes());
     let secString = date.getSeconds() <10 ? `0${date.getSeconds()}`: (date.getSeconds());
     return `${yearString}-${monthString}-${dayString} ${hourString}:${minString}:${secString} (UTC+08:00)`;
}

export default {
     isEmpty,
     convertTime
}