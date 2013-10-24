/**
* @des    cookie
* @author 斯人
* @date 2012-06-01
* @upate [{luis|迁移到jquery基础类库|2012-06-01},{author|dex|date}]
* @api  cookie存取的第一种方法：$.cookie(key,value)和$.cookie(key)，原始cookie存取，不合并
*                               $.cookie.set(key,value)和$.cookie.get(key);合并cookie的存取

**
* V1.1
* @Frank.F
* @2013.8.28
* @Change log: 
*   1. By using the default cookie function, set it as session cookie if not defined the expire time.
*   2. By using get/move function, set the expire time in 2000 days.
*   3. Auto delete the last cookie when the combined one is too long (larger than 2k).
*   4. Set defult path as blank.
*   5. Convert the expire time in combined cookie into duotricemary notation.
*   6. If a cookie has been updated, move it to the first place of the combined data.
*   7. Fixed some bugs.
* @2013.10.22
*   1. Update the comments.
*   2. Update set function's logic.

* @Usage: 
*   Original jQuery Cookie Set: $.cookie(key, value[, option]);
*   Original jQuery Cookie Get: $.cookie(key);
*   Combined Cookie Set: $.cookie.set(key, value[, expires]);
*   Combined Cookie Get: $.cookie.set(key);
*/
;;(function ($, DOC, NAME) {

    var cookieNamePre = "HCD_", // Cookie name's prefix
    cookieNameSuffix = 0, // Cookie data's number
    curCookieName = cookieNamePre + cookieNameSuffix, // Current cookie name
    ENCODE = encodeURIComponent,
    DECODE = decodeURIComponent,
    NULL = null,

    /**
     * Whether a string is not empty
     * @param  {String} o  String value
     * @return {Boolean}   True is not empty; false is empty
     */
    notEmpty = function (o) {
        return o + "" === o && o !== "";
    },

    /**
     * Convert expire time's format from day to millisecond
     * @param  {Number} expires Expire days
     * @return {String}         Expire time in duotricemary notation
     */
    toTime = function (expires) {
        var time = expires == 0 ? 0 : ((new Date).getTime() + expires * 86400000);
        // convert to duotricemary notation
        return time.toString(32);
    },

    /**
     * Convert expire time UTC string in millisecond
     * @param  {Number} expires Expire days
     * @return {String}         UTC String of the expire time
     */
    toExpires = function (expires) {
        if (expires == 0) return "";
        var date = new Date;
        // conver to decimal system
        date.setTime(parseInt(toTime(expires), 32));
        return date.toUTCString();
    },

    /**
     * Set cookie (original usage)
     * @param {String} name   Cookie's name
     * @param {String|Number} value  Cookie's value
     * @param {Object} Option options
     */
    set = function (name, value, option) {

        option = option || {};

        //session cookie as default
        var expires = Number(option.expires);

        // delete the cookie data while value is equal to null
        if (value === null) {
            expires = -1;
        }

        DOC.cookie = [
            name, '=',
            value,
            expires ? '; expires=' + toExpires(expires) : '',
            notEmpty(option.domain) ? '; domain=' + option.domain : '',
            notEmpty(option.path) ? '; path=' + option.path : '',
            option.secure ? '; secure' : ''
        ].join('');
        name + '=' + value + option.expires + option.domain + option.path + option.secure;
    },

    /**
     * Get cookie (original usage)
     * @param  {String} name Cookie's name
     * @return {String}      Cookie's value
     */
    get = function (name) {
        var result = notEmpty(name) ? DOC.cookie.match('(?:^| )' + name + '(?:(?:=([^;]*))|;|$)') : null;
        return result ? result[1] : result;
    },

    /**
     * Match data with name, in the format of 'name|value|time'
     * @param  {String} name 
     * @param  {String} data 
     * @return {String}      Matched result
     */
    matchAll = function (name, data) {
        var result = (data || "").match('(?:^|,)(' + ENCODE(name) + '\\|[^,]+)');
        return result && result[1];
    },

    /**
     * Check whether the data is overflow and if do so, delete the last one
     * @param  {String} data   
     * @param  {Number} length Limited length
     * @return {String}        Result data value
     */
    checkLength = function (data, length) {
        if (data.length > length) {
            data = data.split(",");
            data.pop();
            data = data.join(",");
            data = checkLength(data, length);
            return data;
        } else {
            return data;
        }
    },

    /**
     * $.cookie() function's entrance
     * @param  {String} name   Cookie's name
     * @param  {String|Number} value  Cookie's value, call get func while is empty, otherwise call set func.
     * @param  {Object} option Options
     * @return {[type]}        Set or get cookie function's return value
     */
    _ = function (name, value, option) {
        return (value || value === NULL || value === "") ? set(ENCODE(name), ENCODE(value), option) : (get(ENCODE(name)) ? DECODE(get(ENCODE(name))) : null);
    };

    /**
     * Set cookie into the combined one, you can set expires only, the other options are default as {domain:"", path:"/", secure:""}
     * @param {String} name    Cookie's name
     * @param {String|Number} value   Cookie's value
     * @param {Number} expires Cookie's expire days
     */
    _.set = function (name, value, expires) {

        //anyway, delete the original cookie data
        set(ENCODE(name), null);

        var result = get(curCookieName) || "",

        //old data
        matchData = matchAll(name, result) || "";

        // remove the original cookie and set the new data as the first place
        if ((new RegExp("^" + matchData.replace(/\|/g, "\\|"), "g")).test(result)) {
            var newData = result.replace(matchData, [ENCODE(name), ENCODE(value), toTime(expires || 0)].join("|") + (result.length && !matchData ? "," : ""));
        } else {
            var reg = new RegExp(",?" + matchData.replace(/\|/g, "\\|"), "g"),
                newData = ([ENCODE(name), ENCODE(value), toTime(expires || 0)].join("|") + (result.length ? "," : "")).concat(result.replace(reg, ""));
        }

        // if the data's length is overflow, then delete the last one
        newData = checkLength(newData, 2048);

        //expires ==> timestamp
        set(curCookieName, newData, { expires: 2000, domain: '' });

        return _;
    };

    /**
     * Get cookie from the combined one
     * @param  {String} name Cookie's name
     * @return {String}      Cookie's value
     */
    _.get = function (name) {
        //timestamp
        var _data = get(ENCODE(name));
        if (_data !== null) return DECODE(_data);

        var data = get(curCookieName) || "",
        matchData = matchAll(name, data);

        //null
        if (!matchData) return matchData;

        matchData = matchData.split("|");

        //is not expired
        if (matchData[2] == 0 || Array(matchData[2]) > (new Date).getTime()) return DECODE(matchData[1]);

        //delete when the cookie is exist but expired
        _.del(ENCODE(name));
        return null;
    };

    /**
     * Migrate the old cookie data into the combined one
     * @param  {String} name    Cookie's name which need to be migrated
     * @param  {Number} expires Expire days
     */
    _.move = function (name, expires) {
        var value = get(ENCODE(name));
        value !== null && _.set(name, DECODE(value), expires || 365);
        return _;
    }

    /**
     * Delete a cookie from the combined one
     * @param  {String} name Cookie's name which need to be deleted
     */
    _.del = function (name) {
        //anyway, kill old
        set(ENCODE(name), null);

        var data = get(curCookieName) || "",
        matchData = matchAll(name, data) || "",
        matchReg = new RegExp(",?" + matchData.replace(/\|/g, "\\|") + ",?", "g");
        matchData && set(curCookieName, data.replace(matchReg, ""));
        return _;
    }

    /** Clear the combined cookie */
    _.clear = function () {
        set(curCookieName, "");
        return _;
    }

    _.is = !!navigator.cookieEnabled;


    $[NAME] = _;
})(jQuery, document, "cookie");
