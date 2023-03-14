<template>
  <div class="dashboard">
    <header class="navbar">
      <slot name="header"></slot>
    </header>
    <aside class="sidebar">
      <slot name="sidebar"></slot>
    </aside>
    <main class="main-content">
      <slot name="main-content"></slot>
      <slot name="secondary-content"></slot>
    </main>
  </div>
</template>

<script>
  export default {
    name: 'DashboardLayout'
  }
</script>

<style scoped>
  .dashboard {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  }

  .navbar {
    display: block;
    padding: 0;
    z-index: 2;
  }

  .sidebar {
    display: none;
  }

  .main-content {
    background: #f0f2f7;
    min-height: calc(100vh - 45px);
    width: 100vw;
    padding: 4.0625rem 1.25rem 5rem 1.25rem;
    z-index: 1;
  }

  @media (min-width: 768px) {
    .dashboard {
      flex-direction: row;
    }

    .navbar {
      display: none;
    }

    .sidebar {
      position: fixed;
      display: flex;
    }

    .main-content {
      min-height: 100vh;
      width: calc(100% - 12rem);
      padding: 3rem;
      margin-left: 12rem;
    }
  }
</style>
