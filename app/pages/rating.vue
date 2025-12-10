<script setup lang="ts">
definePageMeta({ layout: 'navigation' })

useSeoMeta({ title: 'Rating Pengguna' })

const { stats, pending } = useFeedback()
</script>

<template>
    <UDashboardPanel :ui="{ body: 'w-full max-w-none px-0' }">
        <template #header>
            <AppNavbar />
        </template>
    
    <template #body>
        <UContainer>
            <div class="py-10">
            <!-- LOADING -->
            <div v-if="pending">
                <div class="flex justify-between">
                    <USkeleton class="h-4" />
                    <USkeleton class="h-4" />
                    <USkeleton class="h-4" />
                </div>
            </div>

            <div v-else>
                <!-- === TOP SUMMARY SECTION === -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                
                <!-- LEFT: Overall Rating -->
                <div class="flex flex-col items-center md:items-start text-center md:text-left">
                    <RatingStar :rating="stats.average" :size="48" />

                    <p class="mt-4 text-lg font-medium text-default">
                    Rating <strong>{{ stats.average }}</strong> dari 
                    <strong>{{ stats.count }}</strong> ulasan
                    </p>
                </div>

                <!-- CENTER: Star distribution -->
                <div>
                    <h3 class="font-semibold text-lg mb-3 text-center text-default">Distribusi Rating</h3>

                    <div v-for="row in stats.perStar" :key="row.star" class="flex items-center gap-3 mb-2">
                        <span class="w-10 text-sm text-default">{{ row.star }} ★</span>

                        <UProgress
                        v-model="row.percent"
                        :max="100"
                        color="warning"
                        class="flex-1"
                        />

                        <span class="w-8 text-right text-sm text-default">{{ row.count }}</span>
                    </div>
                </div>

                <!-- RIGHT: Category distribution -->
                <div>
                    <h3 class="font-semibold text-lg mb-3 text-center text-default">Kategori</h3>

                    <div v-for="cat in stats.categories" :key="cat.category" class="mb-4">
                        <div class="flex justify-between text-sm mb-1 text-default">
                            <span class="font-medium">{{ cat.category }}: {{ cat.count }}</span>
                        </div>

                        <UProgress
                        v-model="cat.percent"
                        :max="100"
                        color="warning"
                        />
                    </div>
                </div>
                </div>

                <!-- === COMMENTS SECTION === -->
                <div class="md:mx-5 lg:mx-17 xl:mx-20">
                <h2 class="font-semibold text-xl mb-6 text-default">Semua Ulasan</h2>

                <div 
                    v-for="fb in stats.list" 
                    :key="fb.id" 
                    class="border rounded-lg p-4 mb-4 bg-default/5 dark:bg-default/10"
                >

                    <!-- USERNAME + RATING (responsive) -->
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-3 mb-2">

                        <!-- USERNAME -->
                        <p class="text-default font-semibold text-sm break-all">
                            {{ fb.username ?? fb.email ?? 'Pengguna' }}
                        </p>

                        <!-- RATING -->
                        <div class="mt-1 sm:mt-0">
                            <RatingStar :rating="fb.rating" :size="20" />
                        </div>
                    </div>

                    <!-- Category -->
                    <UBadge color="primary" variant="soft" class="mb-2">
                        {{ fb.category }}
                    </UBadge>

                    <!-- Message -->
                    <p class="text-sm text-muted whitespace-pre-line">
                        {{ fb.message }}
                    </p>

                </div>
                </div>
            </div>
            </div>
        </UContainer>
    </template>
    </UDashboardPanel>
</template>    