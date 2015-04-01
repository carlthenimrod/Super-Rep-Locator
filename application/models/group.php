<?php

class group extends CI_Model{

    function __construct(){
    	
        parent::__construct();
    }

	function all(){

		//get all groups
		$query = $this->db->get('group');

		//if results, return object
		if( $query->num_rows() > 0 ){

			return $query->result();
		}
		else{

			return false;
		}
	}

	function save($data){

		$this->db->insert('group', $data);

		return $this->db->insert_id();
	}
}