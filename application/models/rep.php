<?php
	class rep extends CI_Model{

		function save(){

			$post = $this->input->post(NULL, TRUE);

			$data = array(

				'name' => $post['name'],
				'address' => $post['address'],
				'city' => $post['city'],
				'state' => $post['state'],
				'zip' => $post['zip'],
				'company' => $post['company'],
				'phone' => $post['phone'],
				'fax' => $post['fax'],
				'email' => $post['email'],
				'web' => $post['web'],
				'lat' => $post['lat'],
				'lng' => $post['lng']
			);

			$this->db->insert('reps', $data);

			$post['id'] = $this->db->insert_id();

			return $post;
		}

		function update($id){

			$post = $this->input->post(NULL, TRUE);

			$data = array(

				'name' => $post['name'],
				'address' => $post['address'],
				'city' => $post['city'],
				'state' => $post['state'],
				'zip' => $post['zip'],
				'company' => $post['company'],
				'phone' => $post['phone'],
				'fax' => $post['fax'],
				'email' => $post['email'],
				'web' => $post['web'],
				'lat' => $post['lat'],
				'lng' => $post['lng']
			);

			$this->db->where('id', $id);
			$this->db->update('reps', $data);

			return $post;
		}

		function delete($id){

			$this->db->where('id', $id);
			$this->db->delete('reps');
		}

		function all(){

			$query = $this->db->get('reps');

			$result = $query->result();

			return $result;
		}
	}
?>