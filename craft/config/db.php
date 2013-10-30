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

  'hlc.joeonjupiter.com' => array(
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

  'hsinlei.com' => array(
		// The database server name or IP address. Usually this is 'localhost' or '127.0.0.1'.
		'server' => 'localhost',

		// The database username to connect with.
		'user' => 'hsinlei_chen',

		// The database password to connect with.
		'password' => 'hsinlei_chen',

		// The name of the database to select.
		'database' => 'hsinlei_portfolio',

		// The prefix to use when naming tables. This can be no more than 5 characters.
		'tablePrefix' => 'craft',
  )

);
