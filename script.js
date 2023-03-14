const postsContainerEl = document.getElementById("posts-container");
const loaderEl = document.getElementById("loader");
const filterEl = document.getElementById("filter");

let limit = 10;
let page = 1;
let loaderIndicate = false;

let dataFromback = [];

const renderItem = (post) => {
  const { id, title, body } = post;
  return `
    <div class="post">
      <div class="number">${id}</div>
      <div class="post_info">
        <h2>${title}</h2>
        <p class="post_body">${body}</p>
      </div>
    </div>
    `;
};
 
const getData = async () => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
    );

    if (!response.ok) {
      throw new Error("Oops try again later ");
    }
    page += 1;
    const data = await response.json();
    dataFromback = [...dataFromback, ...data];
    return data;
  } catch (err) {
    console.log(err);
  }
};

const renderPosts = async () => {
  loaderEl.classList.add("show");
  loaderIndicate = true;

  const data = await getData();
  postsContainerEl.innerHTML += data.reduce(
    (text, element) => (text += renderItem(element)),
    ""
  );
  loaderEl.classList.remove("show");
  loaderIndicate = false;
};

const setScrollCheck = () => {
  if (loaderIndicate) {
    return;
  }

  const { scrollHeight, clientHeight, scrollTop } = document.documentElement;

  if (scrollTop + clientHeight + 1 >= scrollHeight) {
    renderPosts();
    console.log("end");
  }
};

const searchPosts = (event) => {
  const term = event.target.value.toLowerCase();
  const filteredPosts = dataFromback.filter(
    (el) => el.title.toLowerCase().indexOf(term) >= 0
  );
  postsContainerEl.innerHTML = filteredPosts.reduce(
    (accum, el) => (accum += renderItem(el)),
    ""
  );
};




window.addEventListener("scroll", setScrollCheck);
filterEl.addEventListener("input", ()=>{
    fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`)
    .then((response)=> response.json())
    .then((data)=>{
        const searchEl = filterEl.value
        const searchResult = data.filter((item)=>
        item.id.toString().includes(searchEl) || item.title.includes(searchEl) || item.body.includes(searchEl)
        );

        postsContainerEl.innerHTML = searchResult.reduce((text, element)=>(text +=renderItem(element)), "");
    })
    .catch((error)=>{
        console.log("Error", error);
    })
});

renderPosts()