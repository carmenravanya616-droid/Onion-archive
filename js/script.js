let allLinks = [];

fetch('resources/links.json')
  .then(res => res.json())
  .then(data => {
    allLinks = data;
    const page = document.body.dataset.page;
    renderPageLinks(page);
    renderCategories(page);
  });

const linkList = document.getElementById('link-list');
const searchInput = document.getElementById('search');
const randomBtn = document.getElementById('random-link');
const categoriesDiv = document.getElementById('categories');

searchInput.addEventListener('input', () => {
  const page = document.body.dataset.page;
  renderPageLinks(page, searchInput.value, getSelectedCategory());
});

randomBtn.addEventListener('click', () => {
  const page = document.body.dataset.page;
  const filtered = allLinks.filter(l => l.page === page);
  if(filtered.length > 0) {
    const rand = filtered[Math.floor(Math.random() * filtered.length)];
    window.open(rand.url, '_blank');
  }
});

// Render Links
function renderPageLinks(page, search = '', category = 'All') {
  linkList.innerHTML = '';
  const filtered = allLinks.filter(l => 
    l.page === page &&
    l.title.toLowerCase().includes(search.toLowerCase()) &&
    (category === 'All' || l.category === category)
  );
  filtered.forEach(link => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="${link.url}" target="_blank">${link.title}</a><p>${link.description}</p>`;
    linkList.appendChild(li);
  });
}

// Render Category Buttons
function renderCategories(page) {
  const cats = ['All', ...new Set(allLinks.filter(l => l.page === page).map(l => l.category))];
  categoriesDiv.innerHTML = '';
  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      document.querySelectorAll('#categories button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPageLinks(page, searchInput.value, cat);
    });
    categoriesDiv.appendChild(btn);
  });
  categoriesDiv.firstChild.classList.add('active'); // highlight "All"
}

function getSelectedCategory() {
  const active = document.querySelector('#categories button.active');
  return active ? active.textContent : 'All';
}
