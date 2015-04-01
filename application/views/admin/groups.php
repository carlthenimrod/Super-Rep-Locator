<div id="sr-groups">
	<section id="sr-create">
		<form>
			<label for="sr-group-name">New Group:</label>

			<input type="text" id="sr-group-name" name="sr-group-name" />

			<label for="sr-default">Set as Default</label>

			<input type="checkbox" id="sr-default" />

			<button type="submit">Add</button>
		</form>
	</section><!-- #sr-create -->

	<section id="sr-manage">
		<?php if( $groups ) : ?>

		<?php else : ?>
			<p>No Groups - Add Some?</p>
		<?php endif; ?>
	</section><!-- #sr-manage -->
</div><!-- #sr-groups -->