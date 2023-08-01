<nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-body-tertiary sidebar collapse">
  <div class="position-sticky pt-3 sidebar-sticky">
    <ul class="nav flex-column">
      <li class="nav-item">
        <a class="nav-link active" aria-current="page" href="<?= url('/admin/dashboard') ?>">
          <span data-feather="home" class="align-text-bottom"></span>
          Dashboard
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="<?= url('/admin/blogs') ?>">
          <span data-feather="file" class="align-text-bottom"></span>
          Blogs
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="<?= url('/admin/tags') ?>">
          <span data-feather="shopping-cart" class="align-text-bottom"></span>
          Tags
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="<?= url('/admin/users') ?>">
          <span data-feather="users" class="align-text-bottom"></span>
          Users
        </a>
      </li>

    </ul>
  </div>
</nav>