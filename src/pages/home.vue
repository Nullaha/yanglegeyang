<template>
  home
  <el-button>aa</el-button>
  <span>{{ store1.count }}</span>
  <span>{{ store1.double }}</span>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGlobalStore } from '../stores/gameStore'


const router = useRouter()
const store1 = useGlobalStore()
</script>
