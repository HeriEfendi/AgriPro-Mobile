<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[200] flex items-end justify-center sm:items-center"
        @click.self="$emit('close')"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="$emit('close')" />

        <!-- Sheet Panel -->
        <Transition name="sheet-slide">
          <div
            v-if="isOpen"
            class="profile-modal relative w-full max-w-md mx-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            <!-- Handle bar (mobile) -->
            <div class="flex justify-center pt-3 pb-1 sm:hidden">
              <div class="w-10 h-1 bg-slate-200 rounded-full" />
            </div>

            <!-- Header -->
            <div class="px-6 pt-4 pb-3 flex items-center justify-between border-b border-slate-100">
              <h2 class="text-base font-bold text-slate-800">Edit Profil</h2>
              <button
                @click="$emit('close')"
                class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition active:scale-90"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Scrollable Content -->
            <div class="px-6 py-5 space-y-6 max-h-[75vh] overflow-y-auto">

              <!-- ── Avatar Preview ── -->
              <div class="flex flex-col items-center gap-3">
                <div class="relative group">
                  <div class="w-24 h-24 rounded-full ring-4 ring-brand-100 bg-gradient-to-tr from-brand-600 to-brand-400 p-[3px] shadow-lg">
                    <div class="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      <img
                        v-if="form.avatarPreview"
                        :src="form.avatarPreview"
                        alt="Avatar"
                        class="w-full h-full object-cover"
                      />
                      <span v-else class="text-4xl select-none">{{ roleEmoji }}</span>
                    </div>
                  </div>

                  <!-- Camera button -->
                  <button
                    @click="triggerFilePicker"
                    class="absolute bottom-0 right-0 w-8 h-8 bg-brand-600 rounded-full border-2 border-white flex items-center justify-center shadow-md hover:bg-brand-700 transition active:scale-90"
                    title="Upload foto dari galeri"
                  >
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileSelected" />
                </div>

                <div class="flex items-center gap-3">
                  <button
                    @click="triggerFilePicker"
                    class="text-xs font-semibold text-brand-600 bg-brand-50 border border-brand-200 px-3 py-1.5 rounded-full hover:bg-brand-100 transition active:scale-95"
                  >
                    📷 Upload Foto
                  </button>
                  <button
                    v-if="form.avatarPreview"
                    @click="removeAvatar"
                    class="text-xs font-semibold text-red-400 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full hover:bg-red-100 transition active:scale-95"
                  >
                    🗑️ Hapus Foto
                  </button>
                </div>
              </div>

              <!-- ── Preset Avatar Picker ── -->
              <div class="space-y-2.5">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Avatar Preset
                  </label>
                  <span class="text-[10px] text-slate-400">{{ PRESET_AVATARS.length }} pilihan tersedia</span>
                </div>

                <!-- Category tabs -->
                <div class="flex gap-1.5 flex-wrap">
                  <button
                    v-for="cat in avatarCategories"
                    :key="cat.key"
                    @click="activeCategory = cat.key"
                    :class="[
                      'px-3 py-1 rounded-full text-[11px] font-bold transition active:scale-95',
                      activeCategory === cat.key
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    ]"
                  >
                    {{ cat.icon }} {{ cat.label }}
                  </button>
                </div>

                <!-- Avatar grid -->
                <div class="grid grid-cols-6 gap-2">
                  <button
                    v-for="av in filteredAvatars"
                    :key="av.emoji"
                    @click="selectPresetAvatar(av)"
                    :class="[
                      'relative h-12 w-full rounded-2xl flex items-center justify-center text-2xl transition active:scale-90 border-2',
                      selectedPresetEmoji === av.emoji
                        ? 'border-brand-500 bg-brand-50 shadow-md ring-2 ring-brand-200'
                        : 'border-slate-100 bg-slate-50 hover:border-brand-200 hover:bg-brand-50'
                    ]"
                    :title="av.label"
                  >
                    <span class="select-none leading-none">{{ av.emoji }}</span>
                    <!-- Active check -->
                    <div
                      v-if="selectedPresetEmoji === av.emoji"
                      class="absolute -top-1 -right-1 w-4 h-4 bg-brand-600 rounded-full flex items-center justify-center z-10"
                    >
                      <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>

              <!-- ── Nama Pengguna ── -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Nama Pengguna</label>
                <div class="relative">
                  <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    v-model="form.namaPengguna"
                    type="text"
                    placeholder="Masukkan nama Anda..."
                    maxlength="50"
                    class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium placeholder-slate-300 outline-none focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100 transition"
                  />
                </div>
              </div>

              <!-- ── Nama Lahan / Usaha ── -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Nama Lahan / Usaha</label>
                <div class="relative">
                  <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <input
                    v-model="form.namaLahan"
                    type="text"
                    placeholder="cth. Sawah Pak Budi, Tambak Maju..."
                    maxlength="60"
                    class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium placeholder-slate-300 outline-none focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100 transition"
                  />
                </div>
              </div>

              <!-- ── Role / Tipe Usaha ── -->
              <div class="space-y-2">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tipe Usaha Utama</label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="role in roles"
                    :key="role.value"
                    @click="form.role = role.value"
                    :class="[
                      'flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 transition active:scale-95',
                      form.role === role.value
                        ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                        : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                    ]"
                  >
                    <span class="text-2xl">{{ role.emoji }}</span>
                    <span class="text-[11px] font-bold leading-none">{{ role.label }}</span>
                    <span class="text-[10px] leading-none opacity-70">{{ role.sub }}</span>
                  </button>
                </div>
              </div>

            </div>

            <!-- ── Actions ── -->
            <div class="px-6 py-4 border-t border-slate-100 bg-white flex gap-3">
              <button
                @click="$emit('close')"
                class="flex-1 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition active:scale-95"
              >
                Batal
              </button>
              <button
                @click="saveChanges"
                :disabled="isSaving"
                class="flex-1 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-bold shadow-md hover:bg-brand-700 disabled:opacity-60 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                {{ isSaving ? 'Menyimpan...' : 'Simpan Profil' }}
              </button>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { useProfileStore } from '@/stores/useProfileStore';

const props = defineProps({
  isOpen: { type: Boolean, default: false }
});

const emit = defineEmits(['close', 'saved']);

const profileStore = useProfileStore();
const fileInput = ref(null);
const isSaving = ref(false);
const activeCategory = ref('semua');
const selectedPresetEmoji = ref(null);

// ── Roles ──────────────────────────────────────────────────────────
const roles = [
  { value: 'tani',   label: 'Pertanian', sub: 'Sawah & Ladang', emoji: '🌾' },
  { value: 'tambak', label: 'Perikanan', sub: 'Kolam & Tambak', emoji: '🦐' },
  { value: 'ternak', label: 'Peternakan', sub: 'Hewan Ternak',  emoji: '🐄' }
];

// ── Preset Avatars ─────────────────────────────────────────────────
const PRESET_AVATARS = [
  // Petani / Orang
  { emoji: '👨‍🌾', label: 'Petani Laki-laki',    category: 'orang'    },
  { emoji: '👩‍🌾', label: 'Petani Perempuan',     category: 'orang'    },
  { emoji: '🧑‍🌾', label: 'Petani',               category: 'orang'    },
  { emoji: '🤠',   label: 'Cowboy / Peternak',   category: 'orang'    },
  { emoji: '🧑‍🏭', label: 'Operator Tambak',      category: 'orang'    },
  { emoji: '👷',   label: 'Pekerja Lapangan',     category: 'orang'    },

  // Tanaman & Hasil Bumi
  { emoji: '🌾',   label: 'Padi / Gandum',        category: 'tanaman'  },
  { emoji: '🌱',   label: 'Bibit / Kecambah',     category: 'tanaman'  },
  { emoji: '🌿',   label: 'Tanaman Hijau',         category: 'tanaman'  },
  { emoji: '🌻',   label: 'Bunga Matahari',        category: 'tanaman'  },
  { emoji: '🌽',   label: 'Jagung',                category: 'tanaman'  },
  { emoji: '🥬',   label: 'Sayuran Hijau',         category: 'tanaman'  },
  { emoji: '🍅',   label: 'Tomat',                 category: 'tanaman'  },
  { emoji: '🥕',   label: 'Wortel',                category: 'tanaman'  },
  { emoji: '🌶️',  label: 'Cabai',                 category: 'tanaman'  },
  { emoji: '🧅',   label: 'Bawang',                category: 'tanaman'  },

  // Hewan Ternak
  { emoji: '🐄',   label: 'Sapi',                  category: 'ternak'   },
  { emoji: '🐑',   label: 'Domba / Biri-biri',     category: 'ternak'   },
  { emoji: '🐐',   label: 'Kambing',                category: 'ternak'   },
  { emoji: '🐓',   label: 'Ayam Jago',              category: 'ternak'   },
  { emoji: '🐔',   label: 'Ayam Betina',            category: 'ternak'   },
  { emoji: '🦆',   label: 'Bebek',                  category: 'ternak'   },
  { emoji: '🐖',   label: 'Babi / Beternak',        category: 'ternak'   },
  { emoji: '🐇',   label: 'Kelinci',                category: 'ternak'   },

  // Perikanan & Tambak
  { emoji: '🦐',   label: 'Udang',                  category: 'ikan'     },
  { emoji: '🐟',   label: 'Ikan',                   category: 'ikan'     },
  { emoji: '🐠',   label: 'Ikan Hias',              category: 'ikan'     },
  { emoji: '🐡',   label: 'Ikan Buntal / Budidaya', category: 'ikan'     },
  { emoji: '🦀',   label: 'Kepiting',               category: 'ikan'     },
  { emoji: '🦑',   label: 'Cumi-cumi',              category: 'ikan'     },

  // Peralatan & Lahan
  { emoji: '🚜',   label: 'Traktor',                category: 'alat'     },
  { emoji: '🌊',   label: 'Kolam / Perairan',       category: 'alat'     },
  { emoji: '🏡',   label: 'Rumah Tani',             category: 'alat'     },
  { emoji: '⛏️',  label: 'Cangkul',                category: 'alat'     },
  { emoji: '🌤️',  label: 'Cuaca Cerah / Ladang',   category: 'alat'     },
  { emoji: '🪣',   label: 'Ember Tambak',           category: 'alat'     },
];

const avatarCategories = [
  { key: 'semua',  icon: '✨', label: 'Semua'    },
  { key: 'orang',  icon: '👤', label: 'Petani'   },
  { key: 'tanaman',icon: '🌱', label: 'Tanaman'  },
  { key: 'ternak', icon: '🐄', label: 'Ternak'   },
  { key: 'ikan',   icon: '🐟', label: 'Perikanan'},
  { key: 'alat',   icon: '🚜', label: 'Lainnya'  },
];

const filteredAvatars = computed(() => {
  if (activeCategory.value === 'semua') return PRESET_AVATARS;
  return PRESET_AVATARS.filter(a => a.category === activeCategory.value);
});

// ── Form State ─────────────────────────────────────────────────────
const form = reactive({
  namaPengguna: '',
  namaLahan: '',
  role: 'tani',
  avatarPreview: null
});

// Sync form when modal opens
watch(() => props.isOpen, (val) => {
  if (val) {
    form.namaPengguna  = profileStore.namaPengguna;
    form.namaLahan     = profileStore.namaLahan;
    form.role          = profileStore.activeRole;
    form.avatarPreview = profileStore.avatarUrl;
    selectedPresetEmoji.value = null;
    activeCategory.value = 'semua';
  }
});

const roleEmoji = computed(() => roles.find(r => r.value === form.role)?.emoji || '🌾');

// ── Avatar Helpers ─────────────────────────────────────────────────

/** Convert an emoji to a square PNG DataURL via Canvas */
function emojiToDataURL(emoji, size = 128) {
  const canvas = document.createElement('canvas');
  canvas.width  = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  // Soft pastel background
  ctx.fillStyle = '#F0F9F6';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  // Draw emoji centered
  ctx.font = `${Math.floor(size * 0.58)}px serif`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, size / 2, size / 2 + size * 0.04);
  return canvas.toDataURL('image/png');
}

function selectPresetAvatar(av) {
  selectedPresetEmoji.value = av.emoji;
  form.avatarPreview = emojiToDataURL(av.emoji);
}

function triggerFilePicker() {
  fileInput.value?.click();
}

function onFileSelected(event) {
  const file = event.target.files[0];
  if (!file || !file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    form.avatarPreview = e.target.result;
    selectedPresetEmoji.value = null; // clear preset selection
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

function removeAvatar() {
  form.avatarPreview = null;
  selectedPresetEmoji.value = null;
}

// ── Save ───────────────────────────────────────────────────────────
async function saveChanges() {
  isSaving.value = true;
  try {
    await profileStore.setNamaPengguna(form.namaPengguna.trim() || 'Pengguna AgriPro');
    await profileStore.setNamaLahan(form.namaLahan.trim()     || 'Lahan Utama');
    await profileStore.setRole(form.role);
    await profileStore.setAvatarUrl(form.avatarPreview);
    emit('saved');
    emit('close');
  } catch (e) {
    console.error('Error saving profile:', e);
  } finally {
    isSaving.value = false;
  }
}
</script>

<style scoped>
/* Modal fade overlay */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Sheet slide up from bottom */
.sheet-slide-enter-active {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}
.sheet-slide-leave-active {
  transition: transform 0.25s ease, opacity 0.2s ease;
}
.sheet-slide-enter-from,
.sheet-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (min-width: 640px) {
  .sheet-slide-enter-from,
  .sheet-slide-leave-to {
    transform: translateY(0) scale(0.95);
  }
}
</style>
