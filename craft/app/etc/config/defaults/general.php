<?php

/**
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2013, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license Craft License Agreement
 * @link      http://buildwithcraft.com
 */

/**
 * DO NOT EDIT THIS FILE.
 *
 * This file is subject to be overwritten by a Craft update at any time.
 *
 * If you want to change any of these settings, copy it into
 * craft/config/general.php, and make your change there.
 */

return array(

/**
 * The URI segment Craft should look for when determining if the current request should first be routed to a controller action.
 */
'actionTrigger' => 'actions',

/**
 * The URI Craft should use for user account activation. Note that this only affects front-end site requests.
 */
'activateAccountPath' => 'activate',

/**
 * The URI Craft should redirect to when user account activation fails.  Note that this only affects front-end site requests.
 */
'activateFailurePath' => '',

/**
 * A list of file extensions that Craft will allow when a user is uploading files.
 */
'allowedFileExtensions' => '7z,aiff,asf,avi,bmp,csv,doc,docx,fla,flv,gif,gz,gzip,htm,html,jpeg,jpg,mid,mov,mp3,mp4,m4a,m4v,mpc,mpeg,mpg,ods,odt,ogg,pdf,png,ppt,pptx,pxd,qt,ram,rar,rm,rmi,rmvb,rtf,sdc,sitd,swf,sxc,sxw,tar,tgz,tif,tiff,txt,vsd,wav,webm,wma,wmv,xls,xlsx,zip',

/**
 *  Whether Craft should backup the database when updating. This applies to both auto and manual updates.
 */
'backupDbOnUpdate' => true,

/**
 * The length of time Craft will keep things cached in craft/storage/runtime/.
 *
 * Set to '0' to cache things indefinitely.
 *
 * @see http://www.php.net/manual/en/dateinterval.construct.php
 */
'cacheDuration' => 'P1D',

/**
 * The amount of time a user must wait before re-attempting to log in after their account is locked due to too many failed login attempts.
 *
 * Set to '0' to keep the account locked indefinitely, requiring an admin to manually unlock the account.
 *
 * @see http://www.php.net/manual/en/dateinterval.construct.php
 */
'cooldownDuration' => 'PT5M',

/**
 * The URI segment Craft should look for when determining if the current request should route to the CP rather than the front-end website.
 */
'cpTrigger' => 'admin',

/**
 * Any custom ASCII character mappings.
 *
 * This array is merged into the default one in StringHelper::getAsciiCharMap().
 */
'customAsciiCharMappings' => array(),

/**
 * The default permissions Craft will use when creating a folder on the file system.
 */
'defaultFolderPermissions' => 0755,

/**
 * The quality level Craft will use when saving JPG and PNG files. Ranges from 0 (worst quality, smallest file) to 100 (best quality, biggest file).
 */
'defaultImageQuality' => 75,

/**
 * The template file extensions Craft will look for when matching a template path to a file on the front end.
 */
'defaultTemplateExtensions' => array('html', 'twig'),

/**
 * Determines whether the system is in Dev Mode or not.
 */
'devMode' => false,

/**
 * Any environment-specific variables that should be swapped out in URL and Path settings.
 *
 * For example if you set it to:
 *
 *     array(
 *         'siteUrl' => 'http://example.com/'
 *     )
 *
 * ...then you would be able to use "{siteUrl}" in your Site URL setting or the URL settings for your Asset sources.
 */
'environmentVariables' => array(),

/**
 *The template filenames Craft will look for within a directory to represent the directory’s “index” template when matching a template path to a file on the front end.
 */
'indexTemplateFilenames' => array('index'),

/**
 * The amount of time to track invalid login attempts for a user, for determining if Craft should lock an account.
  *
 * @see http://www.php.net/manual/en/dateinterval.construct.php
 */
'invalidLoginWindowDuration' => 'PT1H',

/**
 *  The URI Craft should use for user login.  Note that this only affects front-end site requests.
 */
'loginPath' => 'login',

/**
 * The URI Craft should use for user logout.  Note that this only affects front-end site requests.
 */
'logoutPath' => 'logout',

/**
 * The number of invalid login attempts Craft will allow within the specified duration before the account gets locked.
 */
'maxInvalidLogins' => 5,

/**
 * Whether generated URLs should omit 'index.php', e.g. http://domain.com/path
 * as opposed to showing it, e.g. http://domain.com/index.php/path
 *
 * This can only be possible if your server is configured to redirect would-be 404's to index.php,
 * for example, with the redirect found in the 'htaccess' file that came with Craft:
 *
 *     RewriteEngine On
 *
 *     RewriteCond %{REQUEST_FILENAME} !-f
 *     RewriteCond %{REQUEST_FILENAME} !-d
 *     RewriteRule (.+) /index.php?p=$1 [QSA,L]
 *
 * Possible values: true, false, 'auto'
 */
'omitScriptNameInUrls' => 'auto',

/**
 * Determines whether Craft should override PHP’s session storage location to your craft/storage/ folder.
 *
 * When set to true, Craft will override the location; false will tell Craft to leave the location alone and let PHP store the session where it was configured to.
 *
 * When set to 'auto', Craft will check the default session location to see if it contains “://”, indicating that it might be stored with Memcache or the like. If it does, Craft will leave it alone; otherwise Craft will override it.
 */
'overridePhpSessionLocation' => 'auto',

/**
 * The string preceding a number which Craft will look for when determining if the current request is for a particular page in a paginated list of pages.
 */
'pageTrigger' => 'p',

/**
 * The maximum amount of memory Craft will try to reserve during memory intensive operations such as zipping, unzipping and updating.
 */
'phpMaxMemoryLimit' => '256M',

// PHPPass Config
/**
 * Controls the number of iterations for key stretching. A setting of 8 means the hash algorithm will be applied 2^8 = 256 times.
 *
 * This setting should be kept between 4 and 31.
 */
'phpPass-iterationCount' => 8,

/**
 * The amount of time Craft will remember a username and pre-populate it on the CP login page.
 *
 * Set to '0' to disable this feature altogether.
 *
 * @see http://www.php.net/manual/en/dateinterval.construct.php
 */
'rememberUsernameDuration' => 'P1Y',

/**
 * The amount of time a user stays logged if “Remember Me” is checked on the login page.
 *
 * Set to '0' to disable the “Remember Me” feature altogether.
 *
 * @see http://www.php.net/manual/en/dateinterval.construct.php
 */
'rememberedUserSessionDuration' => 'P2W',

/**
 * Whether Craft should require a matching user agent string when restoring a user session from a cookie.
 */
'requireMatchingUserAgentForSession' => true,

/**
 * Whether Craft should require the existence of a user agent string and IP address when creating a new user session.
 */
'requireUserAgentAndIpForSession' => true,


/**
 * The URI segment Craft should look for when determining if the current request should route to a resource file, either in craft/app/resources/ or a plugin’s resources/ folder.
 */
'resourceTrigger' => 'resources',

/**
 * Whether Craft should attempt to restore the just-created DB backup in the event that there was an error making the database schema changes mandated by the update.
 */
'restoreDbOnUpdateFailure' => true,

/**
 * Words that should be ignored when indexing search keywords and preparing search terms to be matched against the keyword index.
 */
'searchIgnoreWords' => array('the', 'and'),

/**
 * The URI Craft should use for user password resetting. Note that this only affects front-end site requests.
 */
'setPasswordPath' => 'setpassword',

/**
 * The URI Craft should use upon successfully setting a users’s password. Note that this only affects front-end site requests..
 */
'setPasswordSuccessPath' => '',

/**
 * Tells Craft whether to use the CP-managed site routes ('db'), or load them from craft/config/routes.php ('file').
 */
'siteRoutesSource' => 'db',

/**
 * Configures Craft to send all system emails to a single email address, for testing purposes.
 */
'testToEmailAddress' => '',

/**
 * Tells Craft whether to surround all translatable strings with “@” symbols, to help find any strings that are not being run through Craft::t() or the |translate filter.
 */
'translationDebugOutput' => false,

/**
 * Tells Craft whether to use compressed Javascript files whenever possible, to cut down on page load times.
 */
'useCompressedJs' => true,

/**
 * Whether Craft should specify the path using PATH_INFO or as a query string parameter when generating URLs.
 *
 * Note that this setting only takes effect if omitScriptNameInUrls is set to false or 'auto' with a failed “index.php redirect” test.
 *
 * When usePathInfo is set to 'auto', Craft will try to determine if your server is configured to support PATH_INFO, and cache the test results for 24 hours.
 */
'usePathInfo' => 'auto',

/**
 * The amount of time a user stays logged in.
 *
 * Set to false if you want users to stay logged in as long as their browser is open rather than a predetermined amount of time.
 *
 * @see http://www.php.net/manual/en/dateinterval.construct.php
 */
'userSessionDuration' => 'PT1H',

/**
 * Whether Craft should use XSendFile to serve files when possible.
 */
'useXSendFile' => false,

/**
 * The amount of time a user verification code can be used before expiring.
 *
 * @see http://www.php.net/manual/en/dateinterval.construct.php
 */
'verificationCodeDuration' => 'P1D',

/**
 * The permissions Craft will use when creating a new file that must be writable on the file system.
 */
'writableFilePermissions' => 0777,

/**
 * The permissions Craft will use when creating a new folder that must be writable on the file system.
 */
'writableFolderPermissions' => 0777,

/**
* Error Path Keys
* 'errorPath'      => craft.app.templates.errors.error
* 'error400Path'   => craft.app.templates.errors.400
* 'error403Path'   => craft.app.templates.errors.403
* 'error404Path'   => craft.app.templates.errors.404
* 'error500Path'   => craft.app.templates.errors.500
* 'error503Path'   => craft.app.templates.errors.503
* 'exceptionPath'  => craft.app.templates.errors.exception
*/

/**
* Offline Path Key
* 'offlinePath'    => craft.app.templates._offline
*/

);
