<?php
	class User extends CI_Model{

		function validate($email, $password){

			$this->db->select('name', 'email');
			$this->db->from('user');
			$this->db->where('email', $email);
			$this->db->where('password', $password);

			$query = $this->db->get();

			if($query->num_rows() > 0){

				return true;
			}
			else{

				return false;
			}
		}
	}