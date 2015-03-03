<div class="sr-border">
	<div class="sr-ctn">
		<div class="sr-geo">
			<form class="sr-search">
				<label for="sr-address" class="sr-address">Address:</label>
				<input type="textfield" id="sr-address" /><!-- #sr-address -->

				<label for="sr-city">City:</label>
				<input type="textfield" id="sr-city" /><!-- #sr-city -->

				<label for="sr-state">State:</label>
				<input type="textfield" id="sr-state" /><!-- #sr-state -->

				<label for="sr-zip">Zip:</label>
				<input type="textfield" id="sr-zip" /><!-- #sr-zip -->

				<input type="submit" value="Search" />
			</form>
		</div><!-- .sr-geo -->

		<div class="sr-body">
			<div class="sr-map">
				<div class="sr-msg"></div><!-- .sr-msg -->

				<div class="sr-edit-info">
					<form class="sr-info">
						<label for="sr-name" class="sr-name">Name:</label>
						<input type="textfield" id="sr-name" /><!-- #sr-name -->

						<label for="sr-company" class="sr-company">Company:</label>
						<input type="textfield" id="sr-company" /><!-- #sr-company -->

						<label for="sr-address" class="sr-address">Address:</label>
						<input type="textfield" id="sr-address" /><!-- #sr-address -->

						<label for="sr-phone">Phone:</label>
						<input type="textfield" id="sr-phone" /><!-- #sr-phone -->

						<label for="sr-city">City:</label>
						<input type="textfield" id="sr-city" /><!-- #sr-city -->
						
						<label for="sr-fax">Fax:</label>
						<input type="textfield" id="sr-fax" /><!-- #sr-fax -->

						<label for="sr-state">State:</label>
						<input type="textfield" id="sr-state" /><!-- #sr-state -->

						<label for="sr-email">Email:</label>
						<input type="textfield" id="sr-email" /><!-- #sr-email -->

						<label for="sr-zip">Zip:</label>
						<input type="textfield" id="sr-zip" /><!-- #sr-zip -->

						<label for="sr-web">Web:</label>
						<input type="textfield" id="sr-web" /><!-- #sr-web -->

						<div class="sr-loading"><img src="<?php echo base_url(); ?>assets/img/ajax-loader.gif" /></div><!-- .sr-loading -->

						<div class="sr-btns">
							<button type="button" name="hide" class="sr-hide">Hide</button><!-- .sr-hide -->
							<button type="button" name="delete" class="sr-delete">Delete</button><!-- .sr-delete -->

							<button type="reset" name="reset">Reset</button>
							<button type="submit" name="submit">Save</button>
						</div><!-- .sr-btns -->

						<input type="hidden" id="sr-save" value="1" />
						<input type="hidden" id="sr-id" />
					</form>
				</div><!-- .sr-edit-info -->

				<div id="sr-map"></div><!-- #sr-map -->
			</div><!-- .sr-map -->
		</div><!-- .sr-body -->
	</div><!-- .sr-ctn -->
</div><!-- .sr-border -->