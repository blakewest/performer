module.exports.params = function(keyboard) {
  //should contain distance from one note to another, in half steps;
  var distances = {};
  distances[-12] = keyboard.keys[12].model.position.x - keyboard.keys[24].model.position.x;
  distances[-11] = keyboard.keys[12].model.position.x - keyboard.keys[23].model.position.x;
  distances[-10] = keyboard.keys[12].model.position.x - keyboard.keys[22].model.position.x;
  distances[-9] = keyboard.keys[12].model.position.x - keyboard.keys[21].model.position.x;
  distances[-8] = keyboard.keys[12].model.position.x - keyboard.keys[20].model.position.x;
  distances[-7] = keyboard.keys[12].model.position.x - keyboard.keys[19].model.position.x;
  distances[-6] = keyboard.keys[12].model.position.x - keyboard.keys[18].model.position.x;
  distances[-5] = keyboard.keys[12].model.position.x - keyboard.keys[17].model.position.x;
  distances[-4] = keyboard.keys[12].model.position.x - keyboard.keys[16].model.position.x;
  distances[-3] = keyboard.keys[12].model.position.x - keyboard.keys[15].model.position.x;
  distances[-2] = keyboard.keys[12].model.position.x - keyboard.keys[14].model.position.x;
  distances[-1] = keyboard.keys[12].model.position.x - keyboard.keys[13].model.position.x;
  distances[1] = keyboard.keys[1].model.position.x - keyboard.keys[0].model.position.x;
  distances[2] = keyboard.keys[2].model.position.x - keyboard.keys[0].model.position.x;
  distances[3] = keyboard.keys[3].model.position.x - keyboard.keys[0].model.position.x;
  distances[4] = keyboard.keys[4].model.position.x - keyboard.keys[0].model.position.x;
  distances[5] = keyboard.keys[5].model.position.x - keyboard.keys[0].model.position.x;
  distances[6] = keyboard.keys[6].model.position.x - keyboard.keys[0].model.position.x;
  distances[7] = keyboard.keys[7].model.position.x - keyboard.keys[0].model.position.x;
  distances[8] = keyboard.keys[8].model.position.x - keyboard.keys[0].model.position.x;
  distances[9] = keyboard.keys[9].model.position.x - keyboard.keys[0].model.position.x;
  distances[10] = keyboard.keys[10].model.position.x - keyboard.keys[0].model.position.x;
  distances[11] = keyboard.keys[11].model.position.x - keyboard.keys[0].model.position.x;
  distances[12] = keyboard.keys[12].model.position.x - keyboard.keys[0].model.position.x;
  distances.get = function(note1, note2) {
    return keyboard.keys[note1].model.position.x - keyboard.keys[note2].model.position.x;
  }
  return distances;
};

module.exports.distances = function(note1, note2) {
}