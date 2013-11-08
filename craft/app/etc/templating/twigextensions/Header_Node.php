<?php
namespace Craft;

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
 *
 */
class Header_Node extends \Twig_Node
{
	/**
	 * Compiles a Header_Node into PHP.
	 */
	public function compile(\Twig_Compiler $compiler)
	{
		$header = $this->getNode('header');
		$value = $header->getAttribute('value');
		$parts = explode(':', $value);

		if (count($parts) > 1)
		{
			$write = '\Craft\HeaderHelper::setHeader(array(\'';
			$value = trim($parts[0])."' => '".trim($parts[1])."')";
		}
		else
		{
			$write = '\Craft\HeaderHelper::setHeader(\'';
			$value = trim($parts[0]."'");
		}

		$compiler
		    ->addDebugInfo($this)
		    ->write($write)
		    ->raw($value)
		    ->raw(");\n");
	}
}
