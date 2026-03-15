(() => {
  const menuItems = [
    {
      title: "Yuzu Hamachi",
      category: "Sashimi",
      price: "$14",
      description: "Yellowtail sashimi with yuzu soy, micro shiso, and citrus oil.",
      image:
        "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Nagomi Nigiri Set",
      category: "Nigiri",
      price: "$18",
      description: "Chef selection of six seasonal nigiri with warm rice.",
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Charcoal Miso Cod",
      category: "Hot Plates",
      price: "$16",
      description: "Black cod glazed in white miso, served with pickled ginger.",
      image:
        "https://images.unsplash.com/photo-1553621042-7e89c0b73d4f?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Garden Tempura",
      category: "Starters",
      price: "$12",
      description: "Crisp seasonal vegetables, tentsuyu, and smoked sea salt.",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Tokyo Sunset Roll",
      category: "Rolls",
      price: "$15",
      description: "Spicy tuna, avocado, and torch-seared salmon.",
      image:
        "https://images.unsplash.com/photo-1553621042-8d7b1da6f0f5?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Shiso Cucumber Maki",
      category: "Rolls",
      price: "$9",
      description: "Cucumber, shiso, and sesame wrapped in nori.",
      image:
        "https://images.unsplash.com/photo-1553621042-5c9cbf6ec6d7?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Matcha Mochi",
      category: "Dessert",
      price: "$8",
      description: "Soft mochi filled with matcha cream and kinako dust.",
      image:
        "https://images.unsplash.com/photo-1505253213348-6fa7fcb4e963?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Kyoto Spritz",
      category: "Drinks",
      price: "$10",
      description: "Yuzu soda, jasmine tea syrup, and sparkling citrus.",
      image:
        "https://images.unsplash.com/photo-1464306076886-da185f6a7803?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Truffle Uni Toast",
      category: "Chef Specials",
      price: "$19",
      description: "Brioche toast, sea urchin, and white truffle oil.",
      image:
        "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Sesame Salmon Don",
      category: "Rice Bowls",
      price: "$17",
      description: "Salmon sashimi over rice with sesame vinaigrette.",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    },
  ];

  const menuGrid = document.getElementById("menuGrid");
  const categoryList = document.getElementById("categoryList");
  const activeCategory = document.getElementById("activeCategory");
  const menuToggle = document.getElementById("menuToggle");
  const categoryToggle = document.getElementById("categoryToggle");
  const closeSidebar = document.getElementById("closeSidebar");
  const sidebar = document.getElementById("categorySidebar");
  const overlay = document.getElementById("sidebarOverlay");

  if (!menuGrid || !categoryList || !activeCategory) {
    return;
  }

  const categories = ["All", ...new Set(menuItems.map((item) => item.category))];
  let currentCategory = "All";

  const renderCategories = () => {
    categoryList.innerHTML = "";

    categories.forEach((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "category-button";
      button.textContent = category;
      button.dataset.category = category;

      if (category === currentCategory) {
        button.classList.add("active");
      }

      button.addEventListener("click", () => {
        currentCategory = category;
        renderMenu(currentCategory);
        updateActiveCategory();
        updateActiveButtons();
        closeMenu();
      });

      categoryList.appendChild(button);
    });
  };

  const updateActiveButtons = () => {
    const buttons = categoryList.querySelectorAll(".category-button");
    buttons.forEach((button) => {
      button.classList.toggle("active", button.dataset.category === currentCategory);
    });
  };

  const updateActiveCategory = () => {
    activeCategory.textContent = currentCategory;
  };

  const renderMenu = (category) => {
    menuGrid.innerHTML = "";
    const filtered =
      category === "All"
        ? menuItems
        : menuItems.filter((item) => item.category === category);

    filtered.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "menu-card";
      card.style.setProperty("--order", index);

      card.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div class="menu-card-content">
          <div class="menu-card-header">
            <h3 class="menu-title">${item.title}</h3>
            <span class="menu-price">${item.price}</span>
          </div>
          <span class="menu-category">${item.category}</span>
          <p class="menu-desc">${item.description}</p>
        </div>
      `;

      menuGrid.appendChild(card);
    });
  };

  const openMenu = () => {
    sidebar.classList.add("open");
    overlay.classList.add("show");
    sidebar.setAttribute("aria-hidden", "false");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "true");
    }
  };

  const closeMenu = () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
    sidebar.setAttribute("aria-hidden", "true");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
  };

  if (menuToggle) {
    menuToggle.addEventListener("click", openMenu);
  }

  if (categoryToggle) {
    categoryToggle.addEventListener("click", openMenu);
  }

  if (closeSidebar) {
    closeSidebar.addEventListener("click", closeMenu);
  }

  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  renderCategories();
  renderMenu(currentCategory);
  updateActiveCategory();
})();
