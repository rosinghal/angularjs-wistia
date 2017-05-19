(function () {
  'use strict';

  angular
    .module('upload')
    .component('uploadFile', {
      templateUrl: 'js/upload/upload.html',
      controller: UploadController,
      controllerAs: 'vm'
    });

  function UploadController($scope, $timeout, $sce, $http) {
    var vm = this;
    vm.files = {};
    vm.progress = 0;
    vm.status = 'Checking for old uploads';
    vm.checkStatus = checkStatus;
    vm.deleteMedia = deleteMedia;
    vm.handleFile = handleFile;
    vm.listAll = listAll;
    vm.filesLength = filesLength;
    vm.wistiaApiPassword = "b32a71acd5b3a1bab3447ac253eaa80d5c8bfaf3ba1235bb788f6bf56a24790f";

    /* init */
    vm.listAll();

    $('#fileupload').fileupload({
      url: 'https://upload.wistia.com',
      dataType: 'json',
      formData: {
        api_password: vm.wistiaApiPassword
      },
      add: function (e, data) {
        data.submit();
      },
      done: function (e, data) {
        if (data.result) {
          vm.handleFile(data.result);
        }
      },
      progressall: function (e, data) {
        if (data.total > 0) {
          $scope.$apply(function(){
            vm.progress = parseInt(data.loaded / data.total * 100, 10);
          });
        }
      }
    });

    /* functions */

    function handleFile(file) {
      if(file.hashed_id) {
        vm.files[file.hashed_id] = {
          // url: null,
          name: file.name,
          hashed_id: file.hashed_id,
          status: file.status
        };
        if (file.status === 'ready') {
          vm.files[file.hashed_id].embedCode = $sce.trustAsHtml(file.embedCode);
          // file.url = $sce.trustAsResourceUrl('http://fast.wistia.net/embed/iframe/' + hashed_id);
        } else if (file.status !== 'failed') {
          $timeout(function(){
            vm.checkStatus(file.hashed_id);
          }, 2000);
        }
      }
    }

    function deleteMedia(hashed_id) {
      if(vm.files[hashed_id]) {
        $http({
          method: 'DELETE',
          url: 'https://api.wistia.com/v1/medias/' + hashed_id + '.json?api_password=' + vm.wistiaApiPassword
        }).then(function (response) {
          delete vm.files[hashed_id];
        });
      }
    }

    function listAll() {
      $http({
        method: 'GET',
        url: 'https://api.wistia.com/v1/medias.json?api_password=' + vm.wistiaApiPassword
      }).then(function (response) {
        vm.status = null;
        response.data.forEach(function (file) {
          vm.handleFile(file);
        });
      }).catch(function (error) {
        vm.status = null;
      });
    }

    function filesLength() {
      var keys = Object.keys(vm.files);
      return keys.length;
    }

    function checkStatus(hashed_id) {
      $http({
        method: 'GET',
        url: 'https://api.wistia.com/v1/medias/' + hashed_id + '.json?api_password=' + vm.wistiaApiPassword
      }).then(function (response) {
        vm.handleFile(response.data);
      });
    }
  }
}());
