<?php

/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here.
 * You can see a list of the default settings in craft/app/etc/config/defaults/general.php
 */

return array(
    '*' => array(
      'omitScriptNameInUrls' => true,
      'defaultImageQuality' => 80,
    ),

    'local.hsinleichen.com' => array(
    	'devMode'              => false,
    	'useCompressedJs'      => false,

      'environmentVariables' => array(
          'siteUrl' => 'http://local.hsinleichen.com/'
      )
    ),

    'hsinleichen.joeonjupiter.com' => array(
      'environmentVariables' => array(
          'siteUrl' => 'http://hsinleichen.joeonjupiter.com/'
      )
    ),

    'hsinleichen.joeonmars-staging.com' => array(
      'environmentVariables' => array(
          'siteUrl' => 'http://hsinleichen.joeonmars-staging.com/'
      )
    ),

    'www.hsinleichen.com' => array(
    	'cooldownDuration'     => 0,

      'environmentVariables' => array(
          'siteUrl' => 'http://www.hsinleichen.com/'
      )
    )
);
