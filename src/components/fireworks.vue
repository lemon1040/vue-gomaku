<template>
  <canvas class="fireworks" ref="fireworks"></canvas>
</template>

<script>
  import anime from 'animejs/lib/anime.es.js'
  export default {
    name: 'fireworks',
    data () {
      return {
        canvasEl: undefined,
        ctx: undefined,
        render: undefined,
        numberOfParticules: Number(location.href.split('?')[1]) || 40,
        colors: ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C']
      }
    },
    mounted () {
      this.canvasEl = this.$refs.fireworks
      this.ctx = this.canvasEl.getContext('2d')
      this.setCanvasSize()
      this.render = anime({
        duration: Infinity,
        update: () => {
          this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height)
        }
      })
    },
    methods: {
      setCanvasSize () {
        this.canvasEl.width = 592 * 2
        this.canvasEl.height = 592 * 2
        this.canvasEl.style.width = 592 + 'px'
        this.canvasEl.style.height = 592 + 'px'
        this.canvasEl.getContext('2d').scale(2, 2)
      },
      setParticuleDirection (p) {
        let angle = anime.random(0, 360) * Math.PI / 180
        let value = anime.random(50, 180)
        let radius = [-1, 1][anime.random(0, 1)] * value
        return {
          x: p.x + radius * Math.cos(angle),
          y: p.y + radius * Math.sin(angle)
        }
      },

      createParticule (x, y) {
        let p = {}
        p.x = x
        p.y = y
        p.color = this.colors[anime.random(0, this.colors.length - 1)]
        p.radius = anime.random(16, 32)
        p.endPos = this.setParticuleDirection(p)
        p.draw = () => {
          this.ctx.beginPath()
          this.ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true)
          this.ctx.fillStyle = p.color
          this.ctx.fill()
        }
        return p
      },

      createCircle (x, y) {
        var p = {}
        p.x = x
        p.y = y
        p.color = '#FFF'
        p.radius = 0.1
        p.alpha = 0.5
        p.lineWidth = 6
        p.draw = () => {
          this.ctx.globalAlpha = p.alpha
          this.ctx.beginPath()
          this.ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true)
          this.ctx.lineWidth = p.lineWidth
          this.ctx.strokeStyle = p.color
          this.ctx.stroke()
          this.ctx.globalAlpha = 1
        }
        return p
      },

      renderParticule (anim) {
        for (var i = 0; i < anim.animatables.length; i++) {
          anim.animatables[i].target.draw()
        }
      },

      animateParticules (x, y) {
        var circle = this.createCircle(x, y)
        var particules = []
        for (var i = 0; i < this.numberOfParticules; i++) {
          particules.push(this.createParticule(x, y))
        }
        anime.timeline().add({
          targets: particules,
          x: function (p) { return p.endPos.x },
          y: function (p) { return p.endPos.y },
          radius: 0.1,
          duration: anime.random(1200, 1800),
          easing: 'easeOutExpo',
          update: this.renderParticule
        })
          .add({
            targets: circle,
            radius: anime.random(80, 160),
            lineWidth: 0,
            alpha: {
              value: 0,
              easing: 'linear',
              duration: anime.random(600, 800)
            },
            duration: anime.random(1200, 1800),
            easing: 'easeOutExpo',
            update: this.renderParticule,
            offset: 0
          })
      },
      clickThis (pointerX, pointerY) {
        window.human = true
        this.render.play()
        this.animateParticules(pointerX, pointerY)
      }
    }
  }
</script>

<style scoped>
  .fireworks {
    position: absolute;
    pointer-events: none;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
