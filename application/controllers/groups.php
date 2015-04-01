<?php 

class Groups extends CI_Controller{

	function save(){

		if( $this->input->post() ){

			//set rules
			$this->form_validation->set_rules('name', 'Group name', 'required|alpha|is_unique[group.name]');

			//set messages
			$this->form_validation->set_message('required', 'Error: Group Name is required.');
			$this->form_validation->set_message('is_unique', 'Error: Group Name is already being used.');
			$this->form_validation->set_message('alpha', 'Error: Group Name must only contain letters.');

			if( $this->form_validation->run() ){

				//get name
				$name = $this->input->post('name');

				//get default
				if( $this->input->post('default') == '1' ){

					$default = 1;
				}
				else{

					$default = 0;
				}

				$data = array(
					'default' => $default,
					'name' => $name
				);

				//save group
				$id = $this->group->save($data);

				$data['json'] = json_encode( array('id' => $id) );

				$this->load->view('json/data', $data);	
			}
			else{

				$data['json'] = json_encode( array('errors' => validation_errors()) );

				$this->load->view('json/data', $data);	
			}
		}
	}
}