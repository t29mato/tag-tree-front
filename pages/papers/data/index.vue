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
            <div v-for="(axis, index) in coordAxes" :key="index">
              <!-- INFO: 座標軸の点 -->
              <div
                :style="{
                  position: 'absolute',
                  top: `${axis.yPx}px`,
                  left: `${axis.xPx}px`,
                  'pointer-events': 'none',
                  width: '10px',
                  height: '10px',
                  'border-radius': '50%',
                  'background-color': coordAxes.length === 4 ? 'black' : 'red',
                }"
              ></div>
              <!-- INFO: 座標軸名 -->
              <span
                :style="{
                  position: 'absolute',
                  top: `${axis.yPx - 7}px`,
                  left: `${axis.xPx + 12}px`,
                  'pointer-events': 'none',
                }"
                >{{ showAxisName(index) }}</span
              >
            </div>
            <div v-for="(point, index) in points" :key="index">
              <!-- INFO: プロットデータ -->
              <div
                :style="{
                  position: 'absolute',
                  top: `${point.yPx}px`,
                  left: `${point.xPx}px`,
                  'pointer-events': 'none',
                  width: '10px',
                  height: '10px',
                  'border-radius': '50%',
                  'background-color': 'red',
                }"
              ></div>
            </div>
            <!-- INFO: カーソル横の文字 -->
            <div
              v-if="coordAxes.length < 4"
              :style="{
                position: 'absolute',
                left: `${cursorOnGraph.xPx + 7}px`,
                top: `${cursorOnGraph.yPx - 12}px`,
                'pointer-events': 'none',
              }"
            >
              {{ showAxisName(coordAxes.length) }}
            </div>
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
                  cursorOnGraph.xPx - circleRadiusScaledPx
                }px, -${cursorOnGraph.yPx - circleRadiusScaledPx}px)`,
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
            <div v-for="(axis, index) in coordAxes" :key="index">
              <div
                :style="{
                  position: 'absolute',
                  top: `${axis.yPx * scale}px`,
                  left: `${axis.xPx * scale}px`,
                  'pointer-events': 'none',
                  transform: `scale(${scale}) translate(-${
                    cursorOnGraph.xPx - circleRadiusScaledPx
                  }px, -${cursorOnGraph.yPx - circleRadiusScaledPx}px)`,
                  'transform-origin': 'top left',
                  width: '10px',
                  height: '10px',
                  'border-radius': '50%',
                  'background-color': coordAxes.length === 4 ? 'black' : 'red',
                }"
              ></div>
              <span
                :style="{
                  position: 'absolute',
                  top: `${(axis.yPx - 7) * scale}px`,
                  left: `${(axis.xPx + 12) * scale}px`,
                  'pointer-events': 'none',
                  transform: `scale(${scale}) translate(-${
                    cursorOnGraph.xPx - circleRadiusScaledPx
                  }px, -${cursorOnGraph.yPx - circleRadiusScaledPx}px)`,
                  'transform-origin': 'top left',
                }"
                >{{ showAxisName(index) }}</span
              >
            </div>
            <div v-for="(point, index) in points" :key="index">
              <!-- INFO: プロットデータ -->
              <div
                :style="{
                  position: 'absolute',
                  top: `${point.yPx * scale}px`,
                  left: `${point.xPx * scale}px`,
                  transform: `scale(${scale}) translate(-${
                    cursorOnGraph.xPx - circleRadiusScaledPx
                  }px, -${cursorOnGraph.yPx - circleRadiusScaledPx}px)`,
                  'transform-origin': 'top left',
                  'pointer-events': 'none',
                  width: '10px',
                  height: '10px',
                  'border-radius': '50%',
                  'background-color': 'red',
                }"
              ></div>
            </div>
          </div>
          <div v-if="coordAxes.length === 4">
            {{ `x: ${calculateValueX(cursorOnGraph.xPx)}` }}<br />
            {{ `y: ${calculateValueY(cursorOnGraph.yPx)}` }}
          </div>
          <v-slider v-model="scale" thumb-label max="10" min="2"></v-slider>
          <div v-if="coordAxes.length === 4">
            <v-row>
              <v-col vols="6">
                <v-text-field
                  label="x1"
                  type="number"
                  :value="coordAxesValue[indexX1]"
                  @input="inputX1Value"
                ></v-text-field>
              </v-col>
              <v-col vols="6">
                <v-text-field
                  label="x2"
                  type="number"
                  :value="coordAxesValue[indexX2]"
                  @input="inputX2Value"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col vols="6">
                <v-text-field
                  label="y1"
                  type="number"
                  :value="coordAxesValue[indexY1]"
                  @input="inputY1Value"
                ></v-text-field>
              </v-col>
              <v-col vols="6">
                <v-text-field
                  label="y2"
                  type="number"
                  :value="coordAxesValue[indexY2]"
                  @input="inputY2Value"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </template>
    <v-simple-table v-if="points.length > 0 && coordAxes.length === 4">
      <template #default>
        <thead>
          <tr>
            <th>X</th>
            <th>Y</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="point in points" :key="point.id">
            <td>{{ calculateValueX(point.xPx) }}</td>
            <td>{{ calculateValueY(point.yPx) }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

const circleRadiusPx = 5
const [indexX1, indexX2, indexY1, indexY2] = [0, 1, 2, 3]

export default Vue.extend({
  data() {
    return {
      uploadImageUrl: '/img/sample_graph.png',
      coordAxes: [] as {
        xPx: number
        yPx: number
      }[],
      coordAxesValue: [0, 1, 0, 1] as number[],
      cursorOnGraph: {
        xPx: 0,
        yPx: 0,
      },
      color: 'red',
      scale: 5,
      points: [] as { id: number; xPx: number; yPx: number }[],
      indexX1,
      indexX2,
      indexY1,
      indexY2,
    }
  },
  computed: {
    circleRadiusScaledPx(): number {
      // INFO: 99をScaleで割るとMagnifierのプロットの位置がちょうど良くなる。
      // DBに格納される数値ではなくstyle用のものなので、MagicNumberだがよしと考えてる。
      const magicNumber = 99
      return magicNumber / this.scale
    },
  },
  mounted() {},
  created() {},
  methods: {
    inputX1Value(input: string) {
      this.coordAxesValue[indexX1] = Number(input)
    },
    inputX2Value(input: string) {
      this.coordAxesValue[indexX2] = Number(input)
    },
    inputY1Value(input: string) {
      this.coordAxesValue[indexY1] = Number(input)
    },
    inputY2Value(input: string) {
      this.coordAxesValue[indexY2] = Number(input)
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
      if (this.coordAxes.length < 4) {
        this.coordAxes.push({
          xPx: e.offsetX - circleRadiusPx,
          yPx: e.offsetY - circleRadiusPx,
        })
        return
      }
      this.points.push({
        id: this.points.length + 1,
        xPx: e.offsetX - circleRadiusPx,
        yPx: e.offsetY - circleRadiusPx,
      })
    },
    calculateValueX(x: number): number {
      const [x1, x2, y1, y2] = [
        this.coordAxes[indexX1].xPx,
        this.coordAxes[indexX2].xPx,
        this.coordAxesValue[indexX1],
        this.coordAxesValue[indexX2],
      ]
      return ((x - x1) / (x2 - x1)) * (y2 - y1) + y1
    },
    calculateValueY(x: number): number {
      const [x1, x2, y1, y2] = [
        this.coordAxes[indexY1].yPx,
        this.coordAxes[indexY2].yPx,
        this.coordAxesValue[indexY1],
        this.coordAxesValue[indexY2],
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
      this.coordAxes = []
    },
    mouseMove(e: MouseEvent) {
      this.cursorOnGraph = {
        xPx: e.offsetX,
        yPx: e.offsetY,
      }
    },
  },
})
</script>
