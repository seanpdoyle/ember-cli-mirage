import Mirage from 'ember-cli-mirage';
import Ember from 'ember';

export default function() {
  // Contacts
  this.get('/contacts');
  this.get('/contacts', ['contacts', 'addresses']);
  this.get('/contacts/:id');
  this.post('/contacts');
  this.put('/contacts/:id');
  this.del('/contacts/:id');

  // Friends
  this.get('/friends');

  // Pets
  this.get('/pets', function(db) {
    return { pets: db.pets.filter(pet => pet.alive) };
  });

  this.post('/pets', function(db, req) {
    let pet = JSON.parse(req.requestBody).pet;
    if (Ember.isBlank(pet.name)) {
      let body = { errors: { name: ["can't be blank"] } };
      return new Mirage.Response(422, { some: 'header' }, body);
    } else {
      return { pet: db.pets.insert(pet) };
    }
  });

  this.put('/pets/:id', function(db, req) {
    let pet = JSON.parse(req.requestBody).pet;
    db.pets.update(pet.id, pet);
    return pet;
  });

  this.delete('/pets/:id', function(db, req) { }, 200);
}
