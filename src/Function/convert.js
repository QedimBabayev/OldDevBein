export function ConvertTree(array) {
  var map = [{}];
  for (var i = 0; i < array.length; i++) {
    var obj = array[i];
    if (!(obj.id in map)) {
      map[obj.id] = obj;
      map[obj.id].children = [];
    }

    if (typeof map[obj.id].name == "undefined") {
      map[obj.id].title = obj.title;
      map[obj.id].key = obj.key;
      map[obj.id].icon = obj.icon;
    }

    var parent = obj.parent || "-";
    if (!(parent in map)) {
      map[parent] = {};
      map[parent].children = [];
    }

    map[parent].children.push(map[obj.id]);
  }
  return map["-"].children;
}
