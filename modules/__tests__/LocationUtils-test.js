import expect from "expect";
import { createLocation, shouldReplace } from "history";

describe("createLocation", () => {
  describe("with a full path", () => {
    describe("given as a string", () => {
      it("has the correct properties", () => {
        expect(createLocation("/the/path?the=query#the-hash")).toMatchObject({
          pathname: "/the/path",
          search: "?the=query",
          hash: "#the-hash"
        });
      });
    });

    describe("given as an object", () => {
      it("has the correct properties", () => {
        expect(
          createLocation({
            pathname: "/the/path",
            search: "?the=query",
            hash: "#the-hash"
          })
        ).toMatchObject({
          pathname: "/the/path",
          search: "?the=query",
          hash: "#the-hash"
        });
      });
    });
  });

  describe("with a relative path", () => {
    describe("given as a string", () => {
      it("has the correct properties", () => {
        expect(createLocation("the/path?the=query#the-hash")).toMatchObject({
          pathname: "the/path",
          search: "?the=query",
          hash: "#the-hash"
        });
      });
    });

    describe("given as an object", () => {
      it("has the correct properties", () => {
        expect(
          createLocation({
            pathname: "the/path",
            search: "?the=query",
            hash: "#the-hash"
          })
        ).toMatchObject({
          pathname: "the/path",
          search: "?the=query",
          hash: "#the-hash"
        });
      });
    });
  });

  describe("with a path with no pathname", () => {
    describe("given as a string", () => {
      it("has the correct properties", () => {
        expect(createLocation("?the=query#the-hash")).toMatchObject({
          pathname: "/",
          search: "?the=query",
          hash: "#the-hash"
        });
      });
    });

    describe("given as an object", () => {
      it("has the correct properties", () => {
        expect(
          createLocation({ search: "?the=query", hash: "#the-hash" })
        ).toMatchObject({
          pathname: "/",
          search: "?the=query",
          hash: "#the-hash"
        });
      });
    });
  });

  describe("with a path with no search", () => {
    describe("given as a string", () => {
      it("has the correct properties", () => {
        expect(createLocation("/the/path#the-hash")).toMatchObject({
          pathname: "/the/path",
          search: "",
          hash: "#the-hash"
        });
      });
    });

    describe("given as an object", () => {
      it("has the correct properties", () => {
        expect(
          createLocation({ pathname: "/the/path", hash: "#the-hash" })
        ).toMatchObject({
          pathname: "/the/path",
          search: "",
          hash: "#the-hash"
        });
      });
    });
  });

  describe("with a path with no hash", () => {
    describe("given as a string", () => {
      it("has the correct properties", () => {
        expect(createLocation("/the/path?the=query")).toMatchObject({
          pathname: "/the/path",
          search: "?the=query",
          hash: ""
        });
      });
    });

    describe("given as an object", () => {
      it("has the correct properties", () => {
        expect(
          createLocation({ pathname: "/the/path", search: "?the=query" })
        ).toMatchObject({
          pathname: "/the/path",
          search: "?the=query",
          hash: ""
        });
      });
    });
  });

  describe("with a path that cannot be decoded", () => {
    describe("given as a string", () => {
      it("throws custom message when decodeURI throws a URIError", () => {
        expect(() => {
          createLocation("/test%");
        }).toThrow('Pathname "/test%" could not be decoded.');
      });
    });

    describe("given as an object", () => {
      it("throws custom message when decodeURI throws a URIError", () => {
        expect(() => {
          createLocation({ pathname: "/test%" });
        }).toThrow('Pathname "/test%" could not be decoded.');
      });
    });
  });

  describe("key", () => {
    it("has a key property if a key is provided", () => {
      const location = createLocation("/the/path", undefined, "key");
      expect(Object.keys(location)).toContain("key");
    });

    it("has no key property if no key is provided", () => {
      const location = createLocation("/the/path");
      expect(Object.keys(location)).not.toContain("key");
    });
  });
});

describe("shouldReplace", () => {
  it("should return true if current path is the same as new path", () => {
    const currentLocation = {
      pathname: "the/path",
      search: "?the=query",
      hash: "#the-hash"
    };
    expect(shouldReplace(currentLocation, 'the/path?the=query#the-hash')).toBeTruthy();
  });

  it("should return false if current path is other than new path", () => {
    const currentLocation = {
      pathname: "the/path",
      search: "?the=query",
      hash: "#the-hash"
    };
    expect(shouldReplace(currentLocation, 'the/path?the=query')).toBeFalsy();
  });

  it("should return true if current path is the same as new path and current state is the same as new state", () => {
    const currentLocation = {
      pathname: "the/path",
      search: "?the=query",
      hash: "#the-hash",
      state: {
        foo: 'bar',
        obj: {
          foo2: 'var2'
        }
      }
    };
    expect(shouldReplace(
      currentLocation, 
      'the/path?the=query#the-hash',
      {
        foo: 'bar',
        obj: {
          foo2: 'var2'
        }
      }
    )).toBeTruthy();
  });

  it("should return false if current path is the same as new path and current state is other than new state", () => {
    const currentLocation = {
      pathname: "the/path",
      search: "?the=query",
      hash: "#the-hash",
      state: {
        foo: 'bar',
        obj: {
          foo2: 'var2'
        }
      }
    };
    expect(shouldReplace(
      currentLocation, 
      'the/path?the=query#the-hash',
      {
        foo: 'bar',
        obj: {
          foo2: 'var3'
        }
      }
    )).toBeFalsy();
  });
});
