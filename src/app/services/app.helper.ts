import { Injectable } from '@angular/core';

@Injectable()
export class AppHelper {

  public getBadge($days) {
    const badges = [
      '../../assets/images/badges/week.png',
      '../../assets/images/badges/month.png',
      '../../assets/images/badges/3month.png',
      '../../assets/images/badges/6month.png',
      '../../assets/images/badges/1year.png'
    ];

    if ($days <= 7) {
      return badges[0]
    } else if ($days <= 30) {
      return badges[1]
    } else if ($days <= 90) {
      return badges[2]
    } else if ($days <= 180) {
      return badges[3]
    } else if ($days <= 365) {
      return badges[4]
    }
  }

  public dateDiff($dateFuture: Date) {
    const dateNow = new Date()
    const dateFuture = new Date($dateFuture)
    return new function () {
      this.seconds = Math.floor((dateFuture.getTime() - (dateNow.getTime())) / 1000);
      this.minutes = Math.floor(this.seconds / 60);
      this.hours = Math.floor(this.minutes / 60);
      this.days = Math.floor(this.hours / 24);

      this.hours = Math.floor(this.minutes / 60) % 24;
    }
  }

  public removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  public GetLocalStorage(params) {
    let storage: any = {};
    params.forEach(param => {
      storage[param] = localStorage.getItem(param);
    })
    return storage;
  }

  public ClearLocalStorage(params) {
    for (var key in params) {
      localStorage.removeItem(key)
    }
  }

  public setCookie($cname, $cvalue, $exdays) {
    var d = new Date();
    d.setTime(d.getTime() + ($exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = $cname + "=" + $cvalue + ";" + expires + ";path=/";
  }

  public getCookie($cname) {
    var name = $cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  public checkCookie($cname) {
    var cname = this.getCookie($cname);
    if (cname) {
      return true;
    } else {
      return false;
    }
  }

  public removeCookie($cname) {
    document.cookie = $cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }


}