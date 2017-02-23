/* Copyright (c) 2017 MIT 6.813/6.831 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

 /**
 * This object represents a candy on the board. Candies have a row
 * and a column, and a color
 */

var Candy = function(color, id)
{
 ////////////////////////////////////////////////
 // Representation
 //

 // Two immutable properties
 Object.defineProperty(this, 'color', {value: color, writable: false});
 Object.defineProperty(this, 'id', {value: id, writable: false});

 // Two mutable properties
 this.row = null;
 this.col = null;

 ////////////////////////////////////////////////
 // Public methods
 //
 this.toString = function()
 {
   var name = this.color;
   return name;
 }
};

Candy.colors = [
  '#CD5C5C', // red
  '#FFFF66', // yellow
  '#82C439', // green
  '#FF860B', // orange
  '#87CEFA', // blue
  '#8B4CB9'  // purple
];
