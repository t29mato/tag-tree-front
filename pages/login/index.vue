<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login form</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-alert v-show="errorMessage" type="error">
                    {{ errorMessage }}
                  </v-alert>
                  <v-text-field
                    v-model="username"
                    prepend-icon="mdi-account"
                    name="login"
                    label="Login"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    v-model="password"
                    prepend-icon="mdi-lock"
                    name="password"
                    label="Password"
                    type="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="login">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { StarrydataApiFactory } from 'starrydata-api-client'
import Axios from 'axios'
import { mapMutations } from 'vuex'

export default Vue.extend({
  data() {
    return {
      username: '',
      password: '',
      apiClient: StarrydataApiFactory(undefined, process.env.TAG_TREE_API_URL),
      errorMessage: '',
    }
  },
  computed: {
    token() {
      return this.$store.state.token.token
    },
  },
  methods: {
    ...mapMutations({
      setToken: 'token/setToken',
    }),
    async login() {
      this.errorMessage = ''
      try {
        const data = {
          type: 'TokenObtainPairView',
          attributes: {
            username: this.username,
            password: this.password,
          },
        }
        await this.$auth.loginWith('refresh', {
          data: {
            data,
          },
        })
        this.$router.push('/tag-tree')
      } catch (error) {
        if (Axios.isAxiosError(error)) {
          switch (error.response?.status) {
            case 401:
              this.errorMessage =
                'The username or password did not match. Please try again.'
              break
            default:
              this.errorMessage = error.message
          }
        } else {
          this.errorMessage = JSON.stringify(error)
        }
      } finally {
        //
      }
    },
  },
})
</script>
