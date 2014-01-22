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
      'generateTransformsAfterPageLoad' => false
    ),

    'local.hsinleichen.com' => array(
    	'devMode'              => false,
    	'useCompressedJs'      => false,

      'environmentVariables' => array(
          'siteUrl' => 'http://local.hsinleichen.com/'
      )
    ),

    'hlc.joeonjupiter.com' => array(
      'environmentVariables' => array(
          'siteUrl' => 'http://hlc.joeonjupiter.com/'
      )
    ),

    'hsinlei.com' => array(
    	'cooldownDuration'     => 0,

      'environmentVariables' => array(
          'siteUrl' => 'http://hsinlei.com/'
      )
    )
);
