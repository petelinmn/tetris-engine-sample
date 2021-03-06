/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

let Engine = __webpack_require__(/*! tetris-engine */ "./node_modules/tetris-engine/dist/index.js").Engine;

let App = new Vue({
   template:
        `<table class="game-table">
            <tbody>
                <tr v-for="row in gameState.body">
                    <td v-for="cell in row"
                        v-bind:class="cell.cssClasses">
                    </td>                    
                </tr>
            </tbody>
        </table>`,
   el: '#app',
   data() {       
      return {
         gameState: {
            body: []
         }
      };
   },
   methods: {
      render(gameState) {
         if (gameState.gameStatus == 3) {
            alert('game over');
         }
         this.gameState = gameState;
      },
      onKeyDown(e) {
         if (e && e.key && this) {
            switch (e.key) {
               case 'Insert':
                  this.$gameEngine.rotateBack();
                  break;
               case 'Delete':
                  this.$gameEngine.rotate();
                  break;
               case 'ArrowUp':
                  this.$gameEngine.moveUp();
                  break;
               case 'ArrowDown':
                  this.$gameEngine.moveDown();
                  break;
               case 'ArrowLeft':
                  this.$gameEngine.moveLeft();
                  break;
               case 'ArrowRight':
                  this.$gameEngine.moveRight();
                  break;
            }
         }
      }
   },
   beforeMount() {

      let areaHeight = 15;
      let areaWidth = 25;

      let defaultHeap = [
         [0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
        
      this.$gameEngine = new Engine(areaHeight, areaWidth, this.render, defaultHeap);

      window.document.body.addEventListener('keydown', this.onKeyDown.bind(this));

      this.$gameEngine.start();
      setInterval(()=>{
         this.$gameEngine.moveDown();
      }, 1000);
   }
});


/***/ }),

/***/ "./node_modules/tetris-engine/dist/engine.js":
/*!***************************************************!*\
  !*** ./node_modules/tetris-engine/dist/engine.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

let Shape = __webpack_require__(/*! ./shape */ "./node_modules/tetris-engine/dist/shape.js").Shape
let ShapeDimension = __webpack_require__(/*! ./shape */ "./node_modules/tetris-engine/dist/shape.js").ShapeDimension

let tetraShapes = __webpack_require__(/*! ./tetra-shapes */ "./node_modules/tetris-engine/dist/tetra-shapes.js")

/**
 * Implements the engine of a game
 */

class Engine {

  /**
   * Initializing new area
   * @param {number} width is the width of the field of the game in squares
   * @param {number} height is the height of the field of the game in squares
   * @param {function} renderHandle The method that will be runned every time 
   *                   when game state will be changed. Receives game render data.
   * @param {Array} default heap for a game
   */
  constructor(width = 15, height = 20, renderHandle, defaultHeap, additionalShapes) {
    if(width <= 0 || height <= 0)
      throw 'Size parameters of the game field are incorrect'

    this.width = width;
    this.height = height;

    this._shapesSet = {};
    for(let key in tetraShapes)
      this._shapesSet[key] = tetraShapes[key];
      
    if(additionalShapes)
      for(let key in additionalShapes)
        this._shapesSet[key] = additionalShapes[key];

    this._gameStatus = GAME_STATUS.INIT;    

    this._statistic = {
      countShapesFalled: 0,
      countShapesFalledByType: { },
      countLinesReduced: 0,
      countDoubleLinesReduced: 0,
      countTrippleLinesReduced: 0,
      countQuadrupleLinesReduced: 0
    }

    this._heap = [];
    if(defaultHeap && defaultHeap.length && defaultHeap[0].length) {

      for(let y = 0; y < defaultHeap.length; y++) {
        let row = [];
        for(let x = 0; x < this.width; x++) { 
          row.push({
            val: 0
          });
        }
        this._heap.push(row);
      }

      let inversedDefaultHeap = defaultHeap.slice().reverse();
      for(let y = 0; y < inversedDefaultHeap.length && y < this.height; y++) {
        let row = inversedDefaultHeap[y];
        for(let x = 0; x < row.length && x < this.width; x++) {
          this._heap[y][x].val = inversedDefaultHeap[y][x]
        }
      }
    }

    this._checkHeapForReduce();

    if(renderHandle) {
      renderHandle(this.state);
      this._renderHandle = renderHandle;
    }
  }

  /**
   * Creates a new Shape
   */
  _newFigure() {
    this._shape = this._nextShape ? this._nextShape : new Shape(this._shapesSet, parseInt(this.width / 2 - 3), this.height);
    this._nextShape = new Shape(this._shapesSet, parseInt(this.width / 2 - 3), this.height);

    let countFalledShapesByThisKind = this._statistic.countShapesFalledByType[this._shape.name];
    if(!countFalledShapesByThisKind)
      this._statistic.countShapesFalledByType[this._shape.name] = 1;
    else 
      this._statistic.countShapesFalledByType[this._shape.name]++;

    this._statistic.countShapesFalled++;
  }

  /**
   * Running a game or turn off a pause mode
   */
  start() {
    if(this._gameStatus !== GAME_STATUS.INIT && this._gameStatus !== GAME_STATUS.PAUSE)
      return false;

    if(this._gameStatus == GAME_STATUS.INIT) {
      this._newFigure();
      this._gameStatus = GAME_STATUS.WORK;
      return true;
    }
    
    if(this._gameStatus == GAME_STATUS.PAUSE) {
      this._gameStatus = GAME_STATUS.WORK;
    }
  }

  /**
   * Turn on a pause mode
   */
  pause() {
    if(this._gameStatus !== GAME_STATUS.WORK)
      return false;

    this._gameStatus = GAME_STATUS.PAUSE;
    return true;
  }

  moveLeft() {
    if(this._gameStatus !== GAME_STATUS.WORK)
     return;

    if(!this._canShapeMove(0, -1))
      return;

    this._shape.position.X--;
    this._renderHandle(this.state);
  }

  moveRight() { 
    if(this._gameStatus !== GAME_STATUS.WORK)
     return;

    if(!this._canShapeMove(0, 1))
      return;

    this._shape.position.X++;
    this._renderHandle(this.state);
  }

  moveUp() { 
    if(this._gameStatus !== GAME_STATUS.WORK)
     return;
     
    if(!this._canShapeMove(1, 0))
      return;
    
    this._shape.position.Y++;
    this._renderHandle(this.state);
  }

  moveDown() { 
    if(this._gameStatus !== GAME_STATUS.WORK)
     return;

    if(!this._canShapeMove(-1, 0)) {
      if(!this._addShapeToHeap()) {
        this._gameStatus = GAME_STATUS.OVER;
        this._renderHandle(this.state);
      }
      return;
    }
      
    
    this._shape.position.Y--;
    this._renderHandle(this.state);
  }

  _addShapeToHeap() {
    let newRowForHeap = [];
    for(let i = 0; i < this.width; i++)
      newRowForHeap.push({
        val: 0
      });

    for(let y = ShapeDimension - 1; y >= 0; y--) {
      let row = this._shape.body[y];
      for(let x = 0; x < ShapeDimension; x++) { 
          let cell = row[x];
          if(cell) {
            let areaIndexY = this._getAreaIndexYFromShape(y);
            
            if(areaIndexY >= this.height) {
              //game over :)
              return false;
            }

            while(areaIndexY >= this._heap.length) {
              this._heap.push(newRowForHeap.slice());
            }

            let areaIndexX = this._getAreaIndexXFromShape(x);
            this._heap[areaIndexY][areaIndexX] = {
              val: 1,
              class: this._shape.name
            };
          }
      }
    }

    this._checkHeapForReduce();

    this._newFigure();
    this._renderHandle(this.state);

    return true;
  }

  _checkHeapForReduce() {
    let linesToRemove = [];
    for(let y = this._heap.length - 1; y >= 0; y--) {
      let row = this._heap[y];
      let isThereEmptySquare = false;
      for(let x = 0; x < row.length; x++) { 
        if(!this._heap[y][x].val) {
          isThereEmptySquare = true;
          break;
        }
      }

      if(!isThereEmptySquare)
        linesToRemove.push(y);
    }

    let newHeap = []
    for (let y = 0; y < this._heap.length; y++) {
      if(linesToRemove.indexOf(y) == -1)
        newHeap.push(this._heap[y]);
    }

    this._statistic.countLinesReduced += linesToRemove.length;
    switch(linesToRemove.length) {
      case 2:
        this._statistic.countDoubleLinesReduced++;
        break;
      case 3:
        this._statistic.countTrippleLinesReduced++;
        break;
      case 4: 
        this._statistic.countQuadrupleLinesReduced++;
        break;
    }

    this._heap = newHeap;
  }

  rotate() { 
    if(this._gameStatus !== GAME_STATUS.WORK)
     return;
    
    if(!this._canShapeMove(0, 0, this._shape.getRotatedBody()))
      return;
      
    this._shape.rotate();
    this._renderHandle(this.state);
  }

  rotateBack() { 
    if(this._gameStatus !== GAME_STATUS.WORK)
     return;

    if(!this._canShapeMove(0, 0, this._shape.getRotatedBackBody()))
      return;
    
    this._shape.rotateBack();
    this._renderHandle(this.state);
  }

  _getShapeIndexX(x) {
    return x - this._shape.position.X;
  }

  _getShapeIndexY(y) {
    return this._shape.position.Y + (ShapeDimension - 1) - y;
  }

  _getAreaIndexXFromShape(shapeX, delta = 0) {
    return shapeX + this._shape.position.X + delta;
  }

  _getAreaIndexYFromShape(shapeY, delta = 0) {
      return this._shape.position.Y + (ShapeDimension - 1) - shapeY + delta;
  }

  /**
   * Specifies that can a shape move. 
   * If new coordinates of shape overlap with coordinates of heap 
   * or are outside the game area the shape can't move
   * @param {*} deltaY specifies vertical moving distance
   * @param {*} deltaX specifies horizontal moving distance
   * @param {*} shapeBody specifies changed body of a shape, for example rotated body
   */
  _canShapeMove(deltaY, deltaX, shapeBody) {
    if(!shapeBody)
      shapeBody = this._shape.body;

    for(let y = 0; y < shapeBody.length; y++) {
      let row = shapeBody[y];
      let areaIndexY = this._getAreaIndexYFromShape(y, deltaY);
      
      for(let x = 0; x < row.length; x++) {
        let cell = row[x];
        if(cell) {
          let areaIndexX = this._getAreaIndexXFromShape(x, deltaX);

          //check will the shape go over the walls and the ground
          if(areaIndexY < 0 || areaIndexX < 0 || areaIndexX >= this.width)
            return false;

          if(this._isHeapSquare(areaIndexY, areaIndexX ))
            return false;
        }
      }
    }

    return true;
  }

  _isShapeSquare(y, x) {
      if(!this._shape || !this._shape.body)
        return false;
      let row = this._shape.body[this._getShapeIndexY(y)];
      return row && row[this._getShapeIndexX(x)];
  }

  _isHeapSquare(y, x) {
    if(!this._heap)
      return false;

    return this._heap[y] && this._heap[y][x].val;
  }

  _getHeapClass(y, x) {
    if(!this._heap)
      return;

    if(!this._heap[y] || !this._heap[y][x].val)
      return;

    return this._heap[y][x].class;
  }

  _getBody() {
    let body = [];
    for (let y = this.height - 1; y >= 0; y--) {
        let row = [];
        for (let x = 0; x < this.width; x++) {
          let isHeap = this._isHeapSquare(y, x);
          let isShape = this._isShapeSquare(y, x);
          let val = isHeap ? 2 : isShape ? 1 : 0; 

          row.push({
              val: val,
              cssClasses: [
                isShape ? 'shape' : null,
                isHeap ? 'heap' : null,
                isShape ? this._shape.name + '' : null,
                isHeap ? this._getHeapClass(y, x) : null
              ]
          });
        }
        body.push(row);

    }
    return body;
  }

  get state() {
    return {
      gameStatus: this._gameStatus,
      body: this._getBody(),
      shapeName: this._shape ? this._shape.name : null,
      nextShapeName: this._nextShape ? this._nextShape.name : null,
      nextShapeBody: this._nextShape ? this._nextShape.body : null,
      statistic: this._statistic
    }
  }
}

/**
 * Enum represents status of a game
 * 
 * INIT - game was not started
 * WORK - game is running
 * PAUSE - game was temporary stopped
 * OVER - game was finished
 */
const GAME_STATUS = {
  INIT: 0,
  WORK: 1,
  PAUSE: 2,
  OVER: 3
}

module.exports = Engine;

/***/ }),

/***/ "./node_modules/tetris-engine/dist/index.js":
/*!**************************************************!*\
  !*** ./node_modules/tetris-engine/dist/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

let Engine = __webpack_require__(/*! ./engine */ "./node_modules/tetris-engine/dist/engine.js")
let tetraShapes = __webpack_require__(/*! ./tetra-shapes */ "./node_modules/tetris-engine/dist/tetra-shapes.js")

module.exports = { Engine, tetraShapes };

/***/ }),

/***/ "./node_modules/tetris-engine/dist/shape.js":
/*!**************************************************!*\
  !*** ./node_modules/tetris-engine/dist/shape.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Max dimension of every shape
 */
const ShapeDimension = 5;

/**
 * Implements a falling shape
 */
class Shape {
    constructor(shapesSet, X = 5, Y = 12) {
        if(!shapesSet)
            console.error('Set of shapes was not setted!')

        this._shape = this._selectNextShape(shapesSet);

        this.position = {
           X: X,
           Y: Y
        };

        this._calculateProperties();
     }

     /**
      * Selecting next shape from the available set of shapes
      * @private
      */
     _selectNextShape(shapesSet) {
        let count = 0;
        let selectedShape;
        for (let prop in shapesSet) {
           if (Math.random() < 1 / ++count)
              selectedShape = prop;
        }
        
        this.name = selectedShape;

        return shapesSet[selectedShape];
     }

     /**
      * Calculating all properties that change when a shape is rotated
      * @private
      */
     _calculateProperties() {
        this._calculatePaddings();
     }

     /**
      * Calculating paddings
      */
     _calculatePaddings() {
        let paddingLeft = ShapeDimension;
        let paddingRight = ShapeDimension;
        let paddingTop = -1;
        let paddingBottom = -1;
  
        for (let y = 0; y < ShapeDimension; y++) {
           for (let x = 0;  x < ShapeDimension; x++) {
              if (this._shape[y][x]) {
                if (paddingLeft > x)
                   paddingLeft = x;

                if (paddingTop < 0) 
                     paddingTop = y;
              }
           }
        }
  
        for (let y = ShapeDimension - 1; y >= 0; y--) {
           for (let x = ShapeDimension - 1;  x >= 0; x--) {
              if (this._shape[y][x]) {
                if (paddingRight > ShapeDimension - 1 - x)
                    paddingRight = ShapeDimension - 1 - x;
  
                if (paddingBottom < 0)
                    paddingBottom = ShapeDimension - 1 - y;
              }
           }
        }
  
        this._paddingLeft = paddingLeft;
        this._paddingRight = paddingRight;
        this._paddingTop = paddingTop;
        this._paddingBottom = paddingBottom;
     }

     /**
      * rotating a shape clockwise
      * @public
      */
     rotate() {  
        this._shape = this.getRotatedBody();
        this._calculateProperties();
     }

     getRotatedBody() {
        let newShape = [];
  
        for (let x = 0;  x < ShapeDimension; x++) {
           let newRow = [];
           for (let y = ShapeDimension - 1; y >= 0; y--) {
              newRow.push(this._shape[y][x]);
           }
           newShape.push(newRow);
        }

        return newShape;
     }
  
     /**
      * rotating a shape counterclockwise
      * @public
      */
     rotateBack() {
        this._shape = this.getRotatedBackBody();
        this._calculateProperties();
     }

     getRotatedBackBody() {
        let newShape = [];
        for (let x = ShapeDimension - 1;  x >= 0; x--) {
           let newRow = [];
           for (let y = 0; y < ShapeDimension; y++) {
              newRow.push(this._shape[y][x]);
           }
           newShape.push(newRow);
        }

        return newShape;
     }

     /**
      * getting actual shape body
      * @public
      */
     get body() {
        return this._shape;
     }
  
     /**
      * getting top padding for shape relatively shape's border
      * @public
      */
     get paddingTop() {
        return this._paddingTop;
     }
  
    /**
      * getting bottom padding for shape relatively shape's border
      * @public
      */
     get paddingBottom() {
        return this._paddingBottom;
     }
  
    /**
      * getting right padding for shape relatively shape's border
      * @public
      */
     get paddingRight() {
        return this._paddingRight;
     }

    /**
      * getting left padding for shape relatively shape's border
      * @public
      */
     get paddingLeft() {
        return this._paddingLeft;
     }
}

module.exports = {
    Shape,
    ShapeDimension
};

/***/ }),

/***/ "./node_modules/tetris-engine/dist/tetra-shapes.js":
/*!*********************************************************!*\
  !*** ./node_modules/tetris-engine/dist/tetra-shapes.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
    IShape: [
       [0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0],
       [1, 1, 1, 1, 0],
       [0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0],
    ],
    ZShape: [
       [0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0],
       [0, 1, 1, 0, 0],
       [0, 0, 1, 1, 0],
       [0, 0, 0, 0, 0],
    ],
    SShape: [
       [0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0],
       [0, 0, 1, 1, 0],
       [0, 1, 1, 0, 0],
       [0, 0, 0, 0, 0],
    ],
    LShape: [
       [0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0],
       [0, 1, 1, 1, 0],
       [0, 1, 0, 0, 0],
       [0, 0, 0, 0, 0],
    ],
    JShape: [
       [0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0],
       [0, 1, 1, 1, 0],
       [0, 0, 0, 1, 0],
       [0, 0, 0, 0, 0],
    ],
    OShape: [
       [0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0],
       [0, 1, 1, 0, 0],
       [0, 1, 1, 0, 0],
       [0, 0, 0, 0, 0],
    ],
    TShape: [
       [0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0],
       [0, 1, 1, 1, 0],
       [0, 0, 1, 0, 0],
       [0, 0, 0, 0, 0],
    ]
 };
 

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map