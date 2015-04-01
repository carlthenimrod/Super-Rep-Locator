<?php 

class Admin extends CI_Controller{

	function __construct(){

		parent::__construct();

		if( !$this->session->userdata('logged_in') ) redirect('users');
	}

	function index(){

		$this->load->view('admin/header');
		$this->load->view('admin/index');
		$this->load->view('admin/footer');
	}

	function save(){

		$save = $this->input->post('save', TRUE);

		if($save){

			$record = $this->rep->save();

			$data['json'] = json_encode($record);
		}
		else{

			$id = $this->input->post('id', TRUE);

			$record = $this->rep->update($id);

			$data['json'] = json_encode($record);
		}

		$this->load->view('json/data', $data);
	}

	function delete(){

		$id = $this->input->post('id', TRUE);
		
		$this->rep->delete($id);

		$data['json'] = json_encode( array('success' => true) );

		$this->load->view('json/data', $data);	
	}

	function all(){

		$records = $this->rep->all();

		$data['json'] = json_encode($records);

		$this->load->view('json/data', $data);
	}

	function geolocator(){

		$this->load->view('admin/geolocator');
	}

	function groups(){

		$data = array();

		$data['groups'] = $this->group->all();

		$this->load->view('admin/groups', $data);
	}

	function settings(){

		$this->load->view('admin/settings');
	}

	function options(){

		$options = $this->options->get();

		$data['json'] = json_encode( $options );

		$this->load->view('json/data', $data);
	}
}