module.exports.params = function(keyboard) {
  //should contain distance from one note to another, in half steps;
  var distances = {};
  distances.get = function(note1, note2) {
    //we add in the +21 to offset the fact that the notes got stripped to an 88 key keyboard, and yet, MIDI notes act as if note 0 on the keyboard
    //is note no. 21
    return keyboard.model.children[note2-21].position.x - keyboard.model.children[note1-21].position.x;
  };
  return distances;
};

module.exports.distances = function(note1, note2) {
}