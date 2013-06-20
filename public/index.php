<?php

// Path to your craft/ folder
$craftPath = '../craft';

// Setup environment-friendly configs
switch ($_SERVER['HTTP_HOST']) {		
	case 'hsinleichen.com' :
		define('ENV', 'live');
		$craftPath = 'craft';
		break;

	case 'hsinleichen.joeonmars-staging.com' :
		define('ENV', 'staging');
		$craftPath = 'craft';
		break;

	default :
		define('ENV', 'local');
		break;
}

// Do not edit below this line
$path = rtrim($craftPath, '/').'/app/index.php';

if (!is_file($path))
{
	exit('Could not find your craft/ folder. Please ensure that <strong><code>$craftPath</code></strong> is set correctly in '.__FILE__);
}

require_once $path;