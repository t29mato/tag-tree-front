<template>
  <v-container>
    <v-file-input
      accept="image/*"
      label="file input"
      @change="loadImage"
    ></v-file-input>
    <template v-if="uploadImageUrl">
      <v-row>
        <v-col cols="9">
          <div :style="{ position: 'relative' }">
            <!-- INFO: plot対象画像 -->
            <img
              :style="{
                cursor: 'crosshair',
                'user-drag': 'none',
                border: 'solid 1px grey',
              }"
              :src="uploadImageUrl"
              @click="plot"
              @mousemove="mouseMove"
            />
            <v-btn @click="clearAxes">座標軸をクリア</v-btn>
            <div v-for="(axis, index) in axesPixel" :key="index">
              <!-- INFO: 座標軸の点 -->
              <div
                :style="{
                  position: 'absolute',
                  top: `${axis.y}px`,
                  left: `${axis.x}px`,
                  'pointer-events': 'none',
                  width: '10px',
                  height: '10px',
                  'border-radius': '50%',
                  'background-color': 'red',
                }"
              ></div>
              <!-- INFO: 座標軸名 -->
              <span
                :style="{
                  position: 'absolute',
                  top: `${axis.y - 7}px`,
                  left: `${axis.x + 12}px`,
                  'pointer-events': 'none',
                }"
                >{{ showAxisName(index) }}</span
              >
            </div>
            <!-- INFO: カーソル横の文字 -->
            <div
              v-if="axesPixel.length < 4"
              :style="{
                position: 'absolute',
                left: `${posOnImage.x + 7}px`,
                top: `${posOnImage.y - 12}px`,
                'pointer-events': 'none',
              }"
            >
              {{ showAxisName(axesPixel.length) }}
            </div>
            <v-chip color="red" @click="changeColor('red')">red</v-chip>
            <v-chip color="green" @click="changeColor('green')">green</v-chip>
            <v-chip color="blue" @click="changeColor('blue')">blue</v-chip>
            <v-chip color="purple" @click="changeColor('purple')"
              >purple</v-chip
            >
            <v-chip color="pink" @click="changeColor('pink')">pink</v-chip>
          </div>
        </v-col>
        <!-- INFO: 拡大鏡 -->
        <v-col>
          <div
            :style="{
              overflow: 'hidden',
              width: '200px',
              height: '200px',
              position: 'relative',
              border: '1px solid grey',
            }"
          >
            <!-- INFO: 拡大鏡の画像 -->
            <img
              :src="uploadImageUrl"
              :style="{
                transform: `scale(${scale}) translate(-${
                  posOnImage.x - circleRadius
                }px, -${posOnImage.y - circleRadius}px)`,
                'transform-origin': 'top left',
              }"
            />
            <!-- INFO: 拡大鏡の縦線 -->
            <div
              :style="{
                position: 'absolute',
                top: '0px',
                left: '0px',
                width: '99px',
                height: '200px',
                'border-right': '1px solid grey',
              }"
            ></div>
            <!-- INFO: 拡大鏡の横線 -->
            <div
              :style="{
                position: 'absolute',
                top: '0px',
                left: '0px',
                width: '200px',
                height: '99px',
                'border-bottom': '1px solid grey',
              }"
            ></div>
            <!-- INFO: 拡大鏡の座標軸 -->
            <div v-for="(axis, index) in axesPixel" :key="index">
              <div
                :style="{
                  position: 'absolute',
                  top: `${axis.y * scale}px`,
                  left: `${axis.x * scale}px`,
                  'pointer-events': 'none',
                  transform: `scale(${scale}) translate(-${
                    posOnImage.x - circleRadius
                  }px, -${posOnImage.y - circleRadius}px)`,
                  'transform-origin': 'top left',
                  width: '10px',
                  height: '10px',
                  'border-radius': '50%',
                  'background-color': 'red',
                }"
              ></div>
              <span
                :style="{
                  position: 'absolute',
                  top: `${(axis.y - 7) * scale}px`,
                  left: `${(axis.x + 12) * scale}px`,
                  'pointer-events': 'none',
                  transform: `scale(${scale}) translate(-${
                    posOnImage.x - circleRadius
                  }px, -${posOnImage.y - circleRadius}px)`,
                  'transform-origin': 'top left',
                }"
                >{{ showAxisName(index) }}</span
              >
            </div>
          </div>
          <div v-if="axesPixel.length === 4">
            {{
              calculateValueX(posOnImage.x) +
              ' ' +
              calculateValueY(posOnImage.y)
            }}
          </div>
          <v-slider v-model="scale" thumb-label max="10" min="2"></v-slider>
        </v-col>
      </v-row>
    </template>
    <h3>
      2. XY座標軸をセット<v-icon
        class="ml-2 mb-1"
        :color="axesPixel.length === 4 ? 'green' : 'grey'"
        >mdi-check-circle</v-icon
      >
    </h3>
    <h3>
      3. XY座標軸の値をセット<v-icon
        class="ml-2 mb-1"
        :color="
          axesValues.filter((value) => value !== null).length === 4
            ? 'green'
            : 'grey'
        "
        >mdi-check-circle</v-icon
      >
    </h3>
    <v-row v-if="axesPixel.length === 4">
      <v-col vols="3">
        <v-text-field
          label="x1"
          type="number"
          :value="axesValues[indexX1]"
          @input="inputX1Value"
        ></v-text-field>
      </v-col>
      <v-col vols="3">
        <v-text-field
          label="x2"
          type="number"
          :value="axesValues[indexX2]"
          @input="inputX2Value"
        ></v-text-field>
      </v-col>
      <v-col vols="3">
        <v-text-field
          label="y1"
          type="number"
          :value="axesValues[indexY1]"
          @input="inputY1Value"
        ></v-text-field>
      </v-col>
      <v-col vols="3">
        <v-text-field
          label="y2"
          type="number"
          :value="axesValues[indexY2]"
          @input="inputY2Value"
        ></v-text-field>
      </v-col>
    </v-row>
    {{
      points.map(
        (point) => calculateValueX(point.x) + ', ' + calculateValueY(point.y)
      )
    }}
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

const circleRadius = 5
const [indexX1, indexX2, indexY1, indexY2] = [0, 1, 2, 3]

export default Vue.extend({
  data() {
    return {
      uploadImageUrl: '/img/sample_graph.png',
      isPointing: false,
      image: {
        width: null,
        height: null,
      },
      axesPixel: [] as {
        x: number
        y: number
      }[],
      axesValues: [0, 1, 0, 1] as number[],
      posOnImage: {} as { x: number; y: number },
      color: 'red',
      scale: 5,
      points: [] as { id: number; x: number; y: number }[],
      indexX1,
      indexX2,
      indexY1,
      indexY2,
    }
  },
  computed: {
    circleRadius(): number {
      // INFO: 99をScaleで割るとMagnifierのプロットの位置がちょうど良くなる
      return 99 / this.scale
    },
  },
  mounted() {},
  created() {},
  methods: {
    inputX1Value(input: string) {
      this.axesValues[indexX1] = Number(input)
    },
    inputX2Value(input: string) {
      this.axesValues[indexX2] = Number(input)
    },
    inputY1Value(input: string) {
      this.axesValues[indexY1] = Number(input)
    },
    inputY2Value(input: string) {
      this.axesValues[indexY2] = Number(input)
    },
    changeColor(color: string) {
      this.color = color
    },
    loadImage(file: File) {
      console.log('loadImage')
      const fr = new FileReader()
      fr.readAsDataURL(file)
      fr.addEventListener('load', () => {
        if (typeof fr.result === 'string') {
          this.uploadImageUrl = fr.result
        } else {
          console.error('string以外の型')
        }
      })
    },
    plot(e: MouseEvent): void {
      if (this.axesPixel.length < 4) {
        this.axesPixel.push({
          x: e.offsetX - circleRadius,
          y: e.offsetY - circleRadius,
        })
        return
      }
      if (this.axesValues.filter((value) => value !== null).length === 4) {
        this.points.push({
          id: this.points.length + 1,
          x: e.offsetX - circleRadius,
          y: e.offsetY - circleRadius,
        })
      }
    },
    calculateValueX(x: number): number {
      const [x1, x2, y1, y2] = [
        this.axesPixel[indexX1].x,
        this.axesPixel[indexX2].x,
        this.axesValues[indexX1],
        this.axesValues[indexX2],
      ]
      return ((x - x1) / (x2 - x1)) * (y2 - y1) + y1
    },
    calculateValueY(x: number): number {
      const [x1, x2, y1, y2] = [
        this.axesPixel[indexY1].y,
        this.axesPixel[indexY2].y,
        this.axesValues[indexY1],
        this.axesValues[indexY2],
      ]
      return ((x - x1) / (x2 - x1)) * (y2 - y1) + y1
    },
    showAxisName(index: number): string {
      switch (index) {
        case 0:
          return 'x1'
        case 1:
          return 'x2'
        case 2:
          return 'y1'
        case 3:
          return 'y2'
        default:
          return '-'
      }
    },
    clearAxes() {
      this.axesPixel = []
    },
    mouseMove(e: MouseEvent) {
      this.posOnImage = {
        x: e.offsetX,
        y: e.offsetY,
      }
    },
  },
})
</script>
