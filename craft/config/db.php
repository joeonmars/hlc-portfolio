<?php

/**
 * Database Configuration
 *
 * All of your system's database configuration settings go in here.
 * You can see a list of the default settings in craft/app/etc/config/defaults/db.php
 */

return array(

  '*' => array(

  ),

  'local.hsinleichen.com' => array(
		// The database server name or IP address. Usually this is 'localhost' or '127.0.0.1'.
		'server' => 'localhost',

		// The database username to connect with.
		'user' => 'root',

		// The database password to connect with.
		'password' => 'root',

		// The name of the database to select.
		'database' => 'hlc-portfolio',

		// The prefix to use when naming tables. This can be no more than 5 characters.
		'tablePrefix' => 'craft',
  ),

  'hsinleichen.joeonjupiter.com' => array(
		// The database server name or IP address. Usually this is 'localhost' or '127.0.0.1'.
		'server' => 'localhost',

		// The database username to connect with.
		'user' => 'joeonmar_root',

		// The database password to connect with.
		'password' => 'joeonmar_root',

		// The name of the database to select.
		'database' => 'joeonmar_hsinleichen',

		// The prefix to use when naming tables. This can be no more than 5 characters.
		'tablePrefix' => 'craft',
  ),

  'hsinleichen.joeonmars-staging.com' => array(
		// The database server name or IP address. Usually this is 'localhost' or '127.0.0.1'.
		'server' => 'pdb3.awardspace.com',

		// The database username to connect with.
		'user' => '1377301_hlc',

		// The database password to connect with.
		'password' => '1377301_hlc',

		// The name of the database to select.
		'database' => '1377301_hlc',

		// The prefix to use when naming tables. This can be no more than 5 characters.
		'tablePrefix' => 'craft',
  ),

  'www.hsinleichen.com' => array(

  )

);
