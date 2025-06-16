```php
<?php
/**
 * Plugin Name: WooCommerce Blue Add to Cart Button
 * Description: Changes the "Add to Cart" button color to blue.
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://example.com
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * WC_Blue_Add_To_Cart_Button Class
 */
class WC_Blue_Add_To_Cart_Button {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_styles' ) );
	}

	/**
	 * Enqueue styles.
	 */
	public function enqueue_styles() {
		if ( is_product() || is_shop() || is_product_category() || is_product_tag() ) {
			wp_enqueue_style( 'wc-blue-add-to-cart-button', plugin_dir_url( __FILE__ ) . 'css/style.css', array(), '1.0.0' );
		}
	}
}

new WC_Blue_Add_To_Cart_Button();

add_action( 'plugins_loaded', 'wc_blue_add_to_cart_button_init' );

/**
 * Initialize the plugin.  Ensures WooCommerce is loaded.
 */
function wc_blue_add_to_cart_button_init() {

	if ( ! class_exists( 'WooCommerce' ) ) {
		add_action( 'admin_notices', 'wc_blue_add_to_cart_button_woocommerce_missing_notice' );
		return;
	}
}


/**
 * Admin notice if WooCommerce is not installed.
 */
function wc_blue_add_to_cart_button_woocommerce_missing_notice() {
	?>
	<div class="error">
		<p><?php _e( 'WooCommerce Blue Add to Cart Button requires WooCommerce to be installed and active.', 'wc-blue-add-to-cart-button' ); ?></p>
	</div>
	<?php
}

/**
 * Create CSS file.  Only runs on activation.
 */
register_activation_hook( __FILE__, 'wc_blue_add_to_cart_button_activate' );

function wc_blue_add_to_cart_button_activate() {
	$upload_dir = wp_upload_dir();
	$css_dir    = trailingslashit( $upload_dir['basedir'] ) . 'wc-blue-add-to-cart-button';
	$css_file   = $css_dir . '/style.css';

	if ( ! is_dir( $css_dir ) ) {
		wp_mkdir_p( $css_dir );
	}

	if ( ! file_exists( $css_file ) ) {
		$css_content = '
/* WooCommerce Blue Add to Cart Button Styles */
.woocommerce a.button,
.woocommerce button.button,
.woocommerce input.button,
.woocommerce #respond input#submit,
.woocommerce #content input.button,
.woocommerce-page a.button,
.woocommerce-page button.button,
.woocommerce-page input.button,
.woocommerce-page #respond input#submit,
.woocommerce-page #content input.button {
	background-color: blue !important;
	color: #fff !important;
	border-color: blue !important;
}

.woocommerce a.button:hover,
.woocommerce button.button:hover,
.woocommerce input.button:hover,
.woocommerce #respond input#submit:hover,
.woocommerce #content input.button:hover,
.woocommerce-page a.button:hover,
.woocommerce-page button.button:hover,
.woocommerce-page input.button:hover,
.woocommerce-page #respond input#submit:hover,
.woocommerce-page #content input.button:hover {
	background-color: darkblue !important;
	border-color: darkblue !important;
}
		';

		file_put_contents( $css_file, $css_content );
	}
}

/**
 * Delete the CSS file on deactivation
 */
register_deactivation_hook( __FILE__, 'wc_blue_add_to_cart_button_deactivate' );

function wc_blue_add_to_cart_button_deactivate() {
	$upload_dir = wp_upload_dir();
	$css_dir    = trailingslashit( $upload_dir['basedir'] ) . 'wc-blue-add-to-cart-button';
	$css_file   = $css_dir . '/style.css';

	if ( file_exists( $css_file ) ) {
		unlink( $css_file );
	}

	if ( is_dir( $css_dir ) ) {
		rmdir( $css_dir );
	}
}

/**
 * Delete the CSS file on uninstall.  This is destructive.
 */
register_uninstall_hook( __FILE__, 'wc_blue_add_to_cart_button_uninstall' );

function wc_blue_add_to_cart_button_uninstall() {
	$upload_dir = wp_upload_dir();
	$css_dir    = trailingslashit( $upload_dir['basedir'] ) . 'wc-blue-add-to-cart-button';
	$css_file   = $css_dir . '/style.css';

	if ( file_exists( $css_file ) ) {
		unlink( $css_file );
	}

	if ( is_dir( $css_dir ) ) {
		rmdir( $css_dir );
	}
}
```
