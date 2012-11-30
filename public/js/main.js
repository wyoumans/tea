var AppRouter = Backbone.Router.extend({

  routes: {
    ""                 : "home",
    "teas"             : "list",
    "teas/page/:page"  : "list",
    "teas/add"         : "addTea",
    "teas/:id"         : "teaDetails",
    "about"            : "about"
  },

  initialize: function () {
    this.headerView = new HeaderView();
    $('.header').html(this.headerView.el);
  },

  home: function (id) {
    if (!this.homeView) {
      this.homeView = new HomeView();
    }
    $('#content').html(this.homeView.el);
    this.headerView.selectMenuItem('home-menu');
  },

  list: function(page) {
    var p = page ? parseInt(page, 10) : 1;
    var teaList = new TeaCollection();
    teaList.fetch({success: function(){
      $("#content").html(new TeaListView({model: teaList, page: p}).el);
    }});
    this.headerView.selectMenuItem('home-menu');
  },

  teaDetails: function (id) {
    var tea = new Tea({_id: id});
    tea.fetch({success: function(){
      $("#content").html(new TeaView({model: tea}).el);
    }});
    this.headerView.selectMenuItem();
  },

  addTea: function() {
    var tea = new Tea();
    $('#content').html(new TeaView({model: tea}).el);
    this.headerView.selectMenuItem('add-menu');
  },

  about: function () {
    if (!this.aboutView) {
      this.aboutView = new AboutView();
    }
    $('#content').html(this.aboutView.el);
    this.headerView.selectMenuItem('about-menu');
  }

});

utils.loadTemplate(['HomeView', 'HeaderView', 'TeaView', 'TeaListItemView', 'AboutView'], function() {
  app = new AppRouter();
  Backbone.history.start();
});