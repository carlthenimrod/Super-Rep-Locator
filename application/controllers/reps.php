<?php class Reps extends CI_Controller{

	function index(){

		$this->load->view('header');
		$this->load->view('reps/index');
		$this->load->view('footer');
	}

	function save(){

		$save = $this->input->post('save', TRUE);

		if($save){

			$record = $this->rep->save();

			$data['json'] = '{

				"id" : '. $record['id'] .',
				"name" : "'. $record['name'] .'",
				"address" : "'. $record['address'] .'",
				"city" : "'. $record['city'] .'",
				"state" : "'. $record['state'] .'",
				"zip" : "'. $record['zip'] .'",
				"company" : "'. $record['company'] .'",
				"phone" : "'. $record['phone'] .'",
				"fax" : "'. $record['fax'] .'",
				"email" : "'. $record['email'] .'",
				"web" : "'. $record['web'] .'",
				"lat" : '. $record['lat'] .',
				"lng" : '. $record['lng'] .'
			}';
		}
		else{

			$id = $this->input->post('id', TRUE);

			$record = $this->rep->update($id);

			$data['json'] = '{

				"id" : '. $record['id'] .',
				"name" : "'. $record['name'] .'",
				"address" : "'. $record['address'] .'",
				"city" : "'. $record['city'] .'",
				"state" : "'. $record['state'] .'",
				"zip" : "'. $record['zip'] .'",
				"company" : "'. $record['company'] .'",
				"phone" : "'. $record['phone'] .'",
				"fax" : "'. $record['fax'] .'",
				"email" : "'. $record['email'] .'",
				"web" : "'. $record['web'] .'",
				"lat" : '. $record['lat'] .',
				"lng" : '. $record['lng'] .'
			}';			
		}

		$this->load->view('json/data', $data);
	}

	function delete(){

		$id = $this->input->post('id', TRUE);
		
		$this->rep->delete($id);

		$data['json'] = '{

			"success" : "true"
		}';

		$this->load->view('json/data', $data);	
	}

	function all(){

		$records = $this->rep->all();

		$data['json'] = json_encode($records);

		$this->load->view('json/data', $data);
	}
}