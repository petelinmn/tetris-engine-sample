let Engine = require('tetris-engine').Engine;

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
