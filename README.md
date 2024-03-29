# jQuery Cookie Plugin

A jQuery plugin for cookie control and support multiple cookies combination, and you can use it even without the jQuery library.

## Compatibility

- IE 6-10, Firefox, Opera, Chrome, Safari
- ltr / rtl
- Windows / Mac

## Getting Start

Require the plugin:

```html
<script tpye="text/javascript" src="jquery.cookie.js"></script>
```

In FIS:

```
require('common:widget/ui/jquery/jquery.cookie.js');
```

## Usage

Create session cookie:

```
$.cookie('the_cookie', 'the_value');
```

Create expiring cookie, 7 days from then:

```
$.cookie('the_cookie', 'the_value', { expires: 7 });
```

Create expiring cookie, valid across entire site:

```
$.cookie('the_cookie', 'the_value', { expires: 7, path: '/' });
```

Create cookie for specified domain

```
$.cookie('the_cookie', 'the_value', { domain: 'the_domain' });
```

Read cookie:

```
$.cookie('the_cookie'); // => "the_value"
$.cookie('not_existing'); // => null
```

Delete cookie:

```
$.cookie('the_cookie', null);
```

Create cookie into the combined one:

```
$.cookie.set('the_cookie', 'the_vlaue'); // Set into the cookie named HCD_0
```

Create expiring cookie into the combined one, 7 days from then:

```
$.cookie.set('the_cookie', 'the_value', { expires: 7 });
```

Read cookie from the combined one:

```
$.cookie.get('the_cookie');
```

Move a individual cookie into the combined one (NOT AVAILABLE):

```
$.cookie.move('the_cookie');
```

Move a individual expiring cookie into the combined one, 7 days from then (NOT AVAILABLE):

```
$.cookie.move('the_cookie', { expires: 7 });
```

Remove a specified cookie from the combined one:

```
$.cookie.del('the_cookie');
```

Clear the whole combined cookie (NOT AVAILABLE):

```
$.cookie.clear();
```

## Release History

* 2013/11/07 - v1.1.2
    - Redeclare jQuery namespace, in order to use jQuery.cookie() without jQuery library.
    - Change the logic of cookie overflow. Now you cannot write the cookie when it's overflow.
    - Add callback function named 'error' into 'set' function's options, it will be called when writing a cookie and it is overflow.
    - Simplify jQuery.cookie.set function's logic.
    - Commented move and clear functions for safe.
    - Some other minor changes and improvements.
* 2013/10/22 - v1.1.1
    - Update the comments.
    - Update set function's logic.
* 2013/08/28 - v1.1.0
    - By using the default cookie function, set it as session cookie if not defined the expire time.
    - By using get/move function, set the expire time in 2000 days.
    - Auto delete the last cookie when the combined one is too long (larger than 2k).
    - Set defult path as blank.
    - Convert the expire time in combined cookie into duotricemary notation.
    - If a cookie has been updated, move it to the first place of the combined data.
    - Fixed some bugs.
* 2012/06/01 - v1.0.0
    - First released version, all basic features supported.

## Authors

* [fengkun](http://gitlab.pro/u/fengkun)
* [yuji](http://gitlab.pro/u/yuji)
