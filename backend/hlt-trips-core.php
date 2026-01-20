<?php
/**
 * Plugin Name: Happy Life Tourism Core
 * Description: Core functionality for Happy Life Tourism (Headless). Registers CPTs, Taxonomies, and API Fields.
 * Version: 1.0.0
 * Author: Antigravity
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * 1. Register 'Trip' Custom Post Type
 */
function hlt_register_trip_cpt() {
	$labels = array(
		'name'                  => 'Trips',
		'singular_name'         => 'Trip',
		'menu_name'             => 'Trips',
		'name_admin_bar'        => 'Trip',
		'add_new'               => 'Add New',
		'add_new_item'          => 'Add New Trip',
		'new_item'              => 'New Trip',
		'edit_item'             => 'Edit Trip',
		'view_item'             => 'View Trip',
		'all_items'             => 'All Trips',
		'search_items'          => 'Search Trips',
		'parent_item_colon'     => 'Parent Trips:',
		'not_found'             => 'No trips found.',
		'not_found_in_trash'    => 'No trips found in Trash.',
		'featured_image'        => 'Trip Cover Image',
		'set_featured_image'    => 'Set trip cover image',
		'remove_featured_image' => 'Remove trip cover image',
		'use_featured_image'    => 'Use as trip cover image',
	);

	$args = array(
		'labels'             => $labels,
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'query_var'          => true,
		'rewrite'            => array( 'slug' => 'trip' ),
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => false,
		'menu_position'      => 5,
		'menu_icon'          => 'dashicons-airplane',
		'supports'           => array( 'title', 'editor', 'thumbnail' ),
		'show_in_rest'       => true, // CRITICAL for Headless
	);

	register_post_type( 'trip', $args );
}
add_action( 'init', 'hlt_register_trip_cpt' );

/**
 * 2. Register Taxonomies: Trip Category & Destination
 */
function hlt_register_taxonomies() {
	// Trip Category
	register_taxonomy( 'trip_category', 'trip', array(
		'labels'            => array(
			'name'          => 'Trip Categories',
			'singular_name' => 'Trip Category',
			'add_new_item'  => 'Add New Category',
		),
		'hierarchical'      => true,
		'show_ui'           => true,
		'show_admin_column' => true,
		'query_var'         => true,
		'rewrite'           => array( 'slug' => 'trip-category' ),
		'show_in_rest'      => true,
	) );

	// Destination
	register_taxonomy( 'destination', 'trip', array(
		'labels'            => array(
			'name'          => 'Destinations',
			'singular_name' => 'Destination',
			'add_new_item'  => 'Add New Destination',
		),
		'hierarchical'      => true,
		'show_ui'           => true,
		'show_admin_column' => true,
		'query_var'         => true,
		'rewrite'           => array( 'slug' => 'destination' ),
		'show_in_rest'      => true,
	) );
}
add_action( 'init', 'hlt_register_taxonomies' );

/**
 * 3. Register Meta Boxes
 */
function hlt_add_meta_boxes() {
	add_meta_box(
		'hlt_trip_details',
		'Trip Details',
		'hlt_render_trip_details_box',
		'trip',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'hlt_add_meta_boxes' );

function hlt_render_trip_details_box( $post ) {
	// Nonce for security
	wp_nonce_field( 'hlt_save_trip_details', 'hlt_trip_details_nonce' );

	$price         = get_post_meta( $post->ID, 'hlt_price', true );
	$duration      = get_post_meta( $post->ID, 'hlt_duration_days', true );
	$is_group      = get_post_meta( $post->ID, 'hlt_is_group_trip', true );
	$hotel_rating  = get_post_meta( $post->ID, 'hlt_hotel_rating', true );
	?>
	<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
		<p>
			<label for="hlt_price"><strong>Price ($)</strong></label><br>
			<input type="number" id="hlt_price" name="hlt_price" value="<?php echo esc_attr( $price ); ?>" class="widefat">
		</p>
		<p>
			<label for="hlt_duration_days"><strong>Duration (Days)</strong></label><br>
			<input type="number" id="hlt_duration_days" name="hlt_duration_days" value="<?php echo esc_attr( $duration ); ?>" class="widefat">
		</p>
		<p>
			<label for="hlt_hotel_rating"><strong>Hotel Rating</strong></label><br>
			<select id="hlt_hotel_rating" name="hlt_hotel_rating" class="widefat">
				<option value="">Select Rating</option>
				<option value="4" <?php selected( $hotel_rating, '4' ); ?>>4 Star</option>
				<option value="5" <?php selected( $hotel_rating, '5' ); ?>>5 Star</option>
			</select>
		</p>
		<p>
			<br>
			<label>
				<input type="checkbox" name="hlt_is_group_trip" value="1" <?php checked( $is_group, '1' ); ?>>
				<strong>Is Group Trip?</strong>
			</label>
		</p>
	</div>
	<?php
}

/**
 * 4. Save Post Data
 */
function hlt_save_trip_meta( $post_id ) {
	if ( ! isset( $_POST['hlt_trip_details_nonce'] ) || ! wp_verify_nonce( $_POST['hlt_trip_details_nonce'], 'hlt_save_trip_details' ) ) {
		return;
	}

	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	// Save fields
	if ( isset( $_POST['hlt_price'] ) ) {
		update_post_meta( $post_id, 'hlt_price', sanitize_text_field( $_POST['hlt_price'] ) );
	}
	if ( isset( $_POST['hlt_duration_days'] ) ) {
		update_post_meta( $post_id, 'hlt_duration_days', sanitize_text_field( $_POST['hlt_duration_days'] ) );
	}
	if ( isset( $_POST['hlt_hotel_rating'] ) ) {
		update_post_meta( $post_id, 'hlt_hotel_rating', sanitize_text_field( $_POST['hlt_hotel_rating'] ) );
	}
	
	// Checkbox handling: if not set, it means unchecked, so delete meta or update to 0
	$is_group = isset( $_POST['hlt_is_group_trip'] ) ? '1' : '0';
	update_post_meta( $post_id, 'hlt_is_group_trip', $is_group );
}
add_action( 'save_post', 'hlt_save_trip_meta' );

/**
 * 5. Register REST API Fields
 */
function hlt_register_rest_fields() {
	// Register meta fields
	$meta_fields = array(
		'hlt_price'           => 'price',
		'hlt_duration_days'   => 'duration_days',
		'hlt_is_group_trip'   => 'is_group_trip',
		'hlt_hotel_rating'    => 'hotel_rating',
	);

	foreach ( $meta_fields as $meta_key => $api_field ) {
		register_rest_field( 'trip', $api_field, array(
			'get_callback' => function( $object ) use ( $meta_key ) {
				return get_post_meta( $object['id'], $meta_key, true );
			},
			'schema' => null,
		) );
	}

	// [NEW] Register 'thumbnail_url'
	register_rest_field( 'trip', 'thumbnail_url', array(
		'get_callback' => function( $object ) {
			if ( $object['featured_media'] ) {
				return get_the_post_thumbnail_url( $object['id'], 'full' );
			}
			return null;
		},
		'schema' => null,
	) );
}
add_action( 'rest_api_init', 'hlt_register_rest_fields' );

/**
 * 6. Fix CORS for Local Development
 */
add_action( 'init', function() {
	header( "Access-Control-Allow-Origin: *" );
	header( "Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE" );
	header( "Access-Control-Allow-Credentials: true" );
	header( 'Access-Control-Allow-Headers: Origin, X-Requested-With, X-WP-Nonce, Content-Type, Accept, Authorization, X-Auth-Token' );
	if ( 'OPTIONS' == $_SERVER['REQUEST_METHOD'] ) {
		status_header( 200 );
		exit();
	}
} );
